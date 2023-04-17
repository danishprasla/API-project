'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://thespongeclub.com/wp-content/uploads/2022/07/Spongebob-House-Guide.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://static.wikia.nocookie.net/spongebob/images/d/df/Spongebob_house_collage.jpg/revision/latest/scale-to-width-down/1000?cb=20190915162500',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://static.wikia.nocookie.net/spongefan/images/d/d5/Patrick_Star%27s_Rock_in_Season_8.png/revision/latest?cb=20180210164315',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://pbs.twimg.com/media/FS7GwTdXoAIYXPe?format=jpg&name=large',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://upload.wikimedia.org/wikipedia/en/3/33/Krusty_Krab_230b.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://pbs.twimg.com/media/FOxjOPZWQAAy8j4.jpg:large',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://static.wikia.nocookie.net/evil/images/0/0f/The_Chum_Bucket.jpg/revision/latest?cb=20150808043543',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://thespongeclub.com/wp-content/uploads/2022/08/The_SpongeBob_SquarePants_Movie_061.webp',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.miamiluxuryhomes.com/wp-content/uploads/2018/03/LAtelier-Miami-Beach-2.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://cdn.vox-cdn.com/thumbor/ISqhUo_TOjt2V4YBeNdDgx3Gcpg=/0x0:1200x801/1200x800/filters:focal(469x373:661x565)/cdn.vox-cdn.com/uploads/chorus_image/image/56158019/04086d921b4a71d86e8a8e739af9009d.0.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://keikibeach.com/wp-content/uploads/2206-768-49.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://tikimoonvillas.com/wp-content/uploads/2018/09/ALOHA-SUNRISE-at-Tiki-Moon-Villas-Laie-HI-96762-www.tikimoonvillas.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://photos.zillowstatic.com/fp/2bffe9aa6c7d800493815e2e068921c7-p_e.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://media.vrbo.com/lodging/71000000/70970000/70966500/70966458/0cdd3070.f6.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://cdngeneral.rentcafe.com/dmslivecafe/3/1641247/1004_1008_Second_Avenue_Picture(20221223105218325).JPG?width=380',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://media-cdn.tripadvisor.com/media/vr-splice-j/09/27/1b/cc.jpg',
        preview: true
      }


    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [
          1, 2, 3, 4, 5, 6, 7, 8
        ]
      }
    })
  }
};
