'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'http://www.unitedspongebob.com/pictures/rock/inside.jpg'
      },
      {
        reviewId: 4,
        url: 'https://media-cdn.tripadvisor.com/media/photo-s/0b/d2/b6/88/view-from-rooftop-pool.jpg'
      },
      {
        reviewId: 8,
        url: 'https://manhattanview.com/wp-content/uploads/2019/05/Kaufu1605_MiMA-2_2084_HR_0.jpg'
      },

    ])

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options,
      {
        id: {
          [Op.in]: [1, 2, 3]
        }
      })
  }
};
