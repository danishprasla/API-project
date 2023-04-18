'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 7,
        review: 'THIS HOUSE IS LITERALLY A ROCK OVER A HOLE IT SUCKS PLUS THERE WAS THIS WEIRD SPONGE INSIDE DURING MY ENTIRE STAY. WISH I COULD GIVE THIS 0 STARS I FEEL SCAMMED!!!!!!',
        stars: 1
      },
      {
        spotId: 2,
        userId: 3,
        review: 'True pinnacle of luxury',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'A fine establishment',
        stars: 5
      },
      {
        spotId: 4,
        userId: 5,
        review: 'This place is awful',
        stars: 2
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Incredible stay, the views, as described, were great',
        stars: 5
      },
      {
        spotId: 6,
        userId: 3,
        review: 'This place was a great stay; however, the A/C was a little weak so it was quite warm',
        stars: 4
      },
      {
        spotId: 7,
        userId: 5,
        review: 'Costs more than what it is worth in my opinion. Still a decent stay',
        stars: 3
      },
      {
        spotId: 3,
        userId: 2,
        review: 'A fantastic location for a great stay out the back of a great restaurant. It was a bit noisy though',
        stars: 4
      },
      {
        spotId: 8,
        userId: 3,
        review: 'I was in Manhattan for a business trip and this was a nice place to stay',
        stars: 5
      }

    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    }, {})
  }
};
