'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// SQLite's constraint helpers only accept a plain table name, so use the object form only when there's a schema
const table = (tableName) => (options.schema ? { schema: options.schema, tableName } : tableName);

// Columns that pointed at another table without a database-level foreign key
const FOREIGN_KEYS = [
  { table: 'Spots', field: 'ownerId', references: 'Users', name: 'Spots_ownerId_fkey' },
  { table: 'Reviews', field: 'userId', references: 'Users', name: 'Reviews_userId_fkey' },
  { table: 'Bookings', field: 'userId', references: 'Users', name: 'Bookings_userId_fkey' },
  { table: 'Bookings', field: 'spotId', references: 'Spots', name: 'Bookings_spotId_fkey' },
  { table: 'ReviewImages', field: 'reviewId', references: 'Reviews', name: 'ReviewImages_reviewId_fkey' }
];
const REVIEW_INDEX = 'Reviews_userId_spotId_unique';

const isSqlite = (queryInterface) => queryInterface.sequelize.getDialect() === 'sqlite';

// SQLite adds and removes constraints by rebuilding the table and dropping the old copy. With foreign keys
// on, that drop cascades and deletes every row that references the table (e.g. all reviews when Spots is
// rebuilt), so turn them off for the rebuild and check integrity afterwards. PRAGMA foreign_keys has no
// effect inside a transaction, so SQLite runs without one; other databases run in a single transaction.
const run = async (queryInterface, change) => {
  const { sequelize } = queryInterface;
  if (!isSqlite(queryInterface)) {
    return sequelize.transaction((transaction) => change({ transaction }));
  }
  await sequelize.query('PRAGMA foreign_keys = OFF');
  try {
    await change({});
    const problems = await sequelize.query('PRAGMA foreign_key_check', { type: 'SELECT' });
    if (problems.length) {
      throw new Error(`Foreign key check failed: ${JSON.stringify(problems)}`);
    }
  } finally {
    await sequelize.query('PRAGMA foreign_keys = ON');
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    await run(queryInterface, async (queryOptions) => {
      for (const fk of FOREIGN_KEYS) {
        await queryInterface.addConstraint(table(fk.table), {
          type: 'foreign key',
          name: fk.name,
          fields: [fk.field],
          references: { table: table(fk.references), field: 'id' },
          // SQLite's removeConstraint only finds foreign keys whose definition includes an ON UPDATE clause
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          ...queryOptions
        });
      }
      await queryInterface.addConstraint(table('Reviews'), {
        type: 'check',
        name: 'Reviews_stars_check',
        fields: ['stars'],
        where: { stars: { [Op.between]: [1, 5] } },
        ...queryOptions
      });
      await queryInterface.addConstraint(table('Spots'), {
        type: 'check',
        name: 'Spots_price_check',
        fields: ['price'],
        where: { price: { [Op.gte]: 0 } },
        ...queryOptions
      });
      // One review per user per spot, so concurrent requests can't both create one
      await queryInterface.addIndex(table('Reviews'), ['userId', 'spotId'], {
        unique: true,
        name: REVIEW_INDEX,
        ...queryOptions
      });
    });
  },

  down: async (queryInterface) => {
    await run(queryInterface, async (queryOptions) => {
      // Postgres drops indexes by name alone, ignoring the table's schema, so qualify the name
      const indexName = options.schema ? `${options.schema}.${REVIEW_INDEX}` : REVIEW_INDEX;
      await queryInterface.removeIndex(table('Reviews'), indexName, queryOptions);
      await queryInterface.removeConstraint(table('Spots'), 'Spots_price_check', queryOptions);
      await queryInterface.removeConstraint(table('Reviews'), 'Reviews_stars_check', queryOptions);
      for (const fk of [...FOREIGN_KEYS].reverse()) {
        await queryInterface.removeConstraint(table(fk.table), fk.name, queryOptions);
      }
    });
  }
};
