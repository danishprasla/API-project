'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        
        startDate: new Date('2023-04-17'),
        endDate: new Date ('2023-04-20')
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date ('2023-05-01'),
        endDate: new Date ('2023-05-07')
      },
      {
        spotId: 2,
        userId: 5,
        startDate: new Date ('2023-05-15'),
        endDate: new Date ('2023-05-18')
      },
      {
        spotId: 3,
        userId: 5,
        startDate: new Date ('2023-06-01'),
        endDate: new Date ('2023-06-07')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date ('2023-07-01'),
        endDate: new Date ('2023-07-07')
      },
      {
        spotId: 4,
        userId: 5,
        startDate: new Date ('2023-08-01'),
        endDate: new Date ('2023-08-07')
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4, 5, 6]
      }
    }, {})
  }
};
