'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options,
      [{
        ownerId: 4,
        address: '124 Conch Street',
        city: 'Bikini Bottom',
        state: 'Pacific Ocean',
        country: 'Underwater',
        lat: -33.785421,
        lng: 151.125226,
        name: 'Home of Spongebob',
        description: 'A house made out of a Pineapple',
        price: 100.00
      },
      {
        ownerId: 1,
        address: '3541 Anchor Way',
        city: 'Bikini Bottom',
        state: 'Pacific Ocean',
        country: 'Underwater',
        lat: -33.788934,
        lng: 151.129678,
        name: 'Home of Patrick',
        description: 'Experience the finest living experience on the planet',
        price: 2550.00
      },
      {
        ownerId: 5,
        address: '221 Coral Avenue',
        city: 'Bikini Bottom',
        state: 'Pacific Ocean',
        country: 'Underwater',
        lat: -33.787820,
        lng: 151.131610,
        name: 'Krusty Krab',
        description: 'Home of the Krabby Patty and owned by Mr. Krabs',
        price: 200.00
      },
      {
        ownerId: 6,
        address: '2219 Flea Bottom',
        city: 'Bikini Bottom',
        state: 'Pacific Ocean',
        country: 'Underwater',
        lat: -33.793500,
        lng: 151.123650,
        name: 'Chum Bucket',
        description: 'A struggling restaurant owned by Plankton.',
        price: 75.00
      },
      {
        ownerId: 2,
        address: '123 Ocean Dr',
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 25.782545,
        lng: -80.131099,
        name: 'Beachfront Condo',
        description: 'Stunning condo feet away from the beach with breathtaking views of the ocean',
        price: 300.00
      },
      {
        ownerId: 2,
        address: '456 Palm St',
        city: 'Honolulu',
        state: 'Hawaii',
        country: 'USA',
        lat: 21.292738,
        lng: -157.836376,
        name: 'Tropical Bungalow',
        description: 'Unwind in this comfotable stay located in Honolulu',
        price: 400.00
      },
      {
        ownerId: 3,
        address: '789 Bayview Dr',
        city: 'San Diego',
        state: 'California',
        country: 'USA',
        lat: 32.710937,
        lng: -117.155722,
        name: 'California Villa',
        description: 'Experience luxury and relaxation in our villa with incredible views!',
        price: 500.00
      },
      {
        ownerId: 3,
        address: '123 Main St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.743062,
        lng: -73.993379,
        name: 'Studio in Manhattan',
        description: 'Bright and comfortable studio apartment in the heart of Manhattan',
        price: 120.00
      }

      ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['Studio in Manhattan', 'California Villa', 'Tropical Bungalow', 'Beachfront Condo', 'Chum Bucket', 'Krusty Krab', 'Home of Patrick', 'Home of Spongebob']
      }
    }, {})
  }
};
