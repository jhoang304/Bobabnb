'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// Photos are served from Unsplash (images.unsplash.com), which allows hotlinking
// and does not expire its links.
const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      { reviewId: 1, url: img('1558857563-b371033873b8') },
      { reviewId: 2, url: img('1747016804753-866c3ed6b3b7') },
      { reviewId: 3, url: img('1734770580735-796a00e42cb2') },
      { reviewId: 4, url: img('1572490122747-3968b75cc699') },
      { reviewId: 5, url: img('1756132539966-8d65f7a9eed8') },
      { reviewId: 7, url: img('1745883949374-baeba0ed57c3') },
      { reviewId: 10, url: img('1525803377221-4f6ccdaa5133') },
      { reviewId: 16, url: img('1674218153634-7f6094a17820') },
      { reviewId: 21, url: img('1575417634984-8e608b88a04b') },
      { reviewId: 23, url: img('1572932759882-bb34c848d1b3') },
      { reviewId: 28, url: img('1661499102718-aebb4886a0bc') },
      { reviewId: 33, url: img('1718065598477-505b9c2e764d') }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 7, 10, 16, 21, 23, 28, 33] }
    }, {});
  }
};
