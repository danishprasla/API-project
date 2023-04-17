'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        username: 'thecook',
        email: 'spongebob@krustykrab.com',
        hashedPassword: bcrypt.hashSync('pineapple'),
        firstName: 'Spongebob',
        lastName: 'Squarepants'
      },
      {
        username: 'ilikemoney',
        email: 'krabs@krustykrab.com',
        hashedPassword: bcrypt.hashSync('money'),
        firstName: 'Eugene',
        lastName: 'Krabs'
      },
      {
        username: 'thegenius',
        email: 'plankton@chumbucket.com',
        hashedPassword: bcrypt.hashSync('secretrecipe'),
        firstName: 'Sheldon',
        lastName: 'Plankton'
      },
      {
        username: 'clarinets4life',
        email: 'squidward@bikinibottom.com',
        hashedPassword: bcrypt.hashSync('clarinet'),
        firstName: 'Squidward',
        lastName: 'Tentacles'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['thecook', 'ilikemoney', 'thegenius', 'clarinets4life'] }
    }, {});
  }
};