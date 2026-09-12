'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Harper',
        lastName: 'Mitchell'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Ethan',
        lastName: 'Anderson'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Ava',
        lastName: 'Sullivan'
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Bryan',
        lastName: 'Tran'
      },
      {
        email: 'user4@user.io',
        username: 'MilkTeaMaven',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Sophia',
        lastName: 'Nguyen'
      },
      {
        email: 'user5@user.io',
        username: 'BobaBaron',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: 'Marcus',
        lastName: 'Lee'
      },
      {
        email: 'user6@user.io',
        username: 'TaroQueen',
        hashedPassword: bcrypt.hashSync('password7'),
        firstName: 'Priya',
        lastName: 'Patel'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'MilkTeaMaven', 'BobaBaron', 'TaroQueen'] }
    }, {});
  }
};
