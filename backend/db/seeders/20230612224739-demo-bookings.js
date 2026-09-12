'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-01-02'),
        endDate: new Date('2023-01-08')
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2023-02-03'),
        endDate: new Date('2023-02-09')
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2023-03-04'),
        endDate: new Date('2023-03-10')
      },
      {
        spotId: 4,
        userId: 2,
        startDate: new Date('2023-04-05'),
        endDate: new Date('2023-04-11')
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2023-05-06'),
        endDate: new Date('2023-05-12')
      },
      {
        spotId: 9,
        userId: 1,
        startDate: new Date('2026-10-03'),
        endDate: new Date('2026-10-07')
      },
      {
        spotId: 12,
        userId: 1,
        startDate: new Date('2026-11-20'),
        endDate: new Date('2026-11-24')
      },
      {
        spotId: 10,
        userId: 4,
        startDate: new Date('2026-10-15'),
        endDate: new Date('2026-10-18')
      },
      {
        spotId: 11,
        userId: 5,
        startDate: new Date('2026-12-01'),
        endDate: new Date('2026-12-05')
      },
      {
        spotId: 13,
        userId: 6,
        startDate: new Date('2026-09-25'),
        endDate: new Date('2026-09-28')
      },
      {
        spotId: 15,
        userId: 7,
        startDate: new Date('2027-01-10'),
        endDate: new Date('2027-01-14')
      },
      {
        spotId: 16,
        userId: 3,
        startDate: new Date('2027-02-14'),
        endDate: new Date('2027-02-16')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
