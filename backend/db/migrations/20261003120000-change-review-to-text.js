'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// Reviews.review was STRING, which is VARCHAR(255) in Postgres, so longer reviews failed with a 500.
// SQLite doesn't enforce VARCHAR lengths, and changeColumn there rebuilds the table and drops the
// ON DELETE CASCADE on spotId, so the change only runs on other databases.
const isSqlite = queryInterface => queryInterface.sequelize.getDialect() === 'sqlite';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (isSqlite(queryInterface)) return;
    options.tableName = 'Reviews';
    await queryInterface.changeColumn(options, 'review', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    if (isSqlite(queryInterface)) return;
    options.tableName = 'Reviews';
    // Fails if any review is longer than 255 characters
    await queryInterface.changeColumn(options, 'review', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
