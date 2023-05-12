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
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683922756/1000_qsxbxr.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://res-console.cloudinary.com/dfgtzibvm/thumbnails/v1/image/upload/v1683922917/ZGwtNDUwMV9pZ2FicmU=/preview',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923024/278911cc04ffa678c06fb5306a1f5ba0_dv8ynk.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923080/latest_urykgc.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923174/DbttasKX4AA5gYg_txkyg8.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923323/Behind-Spongebobs-Squidwards-and-Patricks-houses-spongebob-squarepants-43008676-712-534_vgssjh.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923372/FS7GwTdXoAIYXPe_tt7442.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923405/Krusty_Krab_230b_wbo7tf.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923435/FOxjOPZWQAAy8j4_hblcp6.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923529/h44cilc25v191_craiad.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923571/155062093e8eb3ab5f7ddef62c20ea72_ubhxmz.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923617/latest_azfif1.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923655/The_SpongeBob_SquarePants_Movie_061_rwxml7.webp',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923701/034a_20-_20Welcome_20to_20the_20Chum_20Bucket_20_321_mhkmsw.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923834/j9spbgpmx7k1iqhwan4n.jpg',
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
        spotId: 5,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923913/cvr-missoni-baia-paris-forino_lxjzk5.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683923975/tzeayivcz1vdwuseaidr.jpg',
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
        spotId: 6,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924080/oceanfront-area-of-tiki_bzeceh.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924132/1526667786933_lhawks.jpg',
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
        spotId: 7,
        url: 'https://i.ibb.co/zsJ48cS/BJH-7250-1080x675.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924548/rh7zvghw1gh18zurmwqk.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924585/1004_1008_Second_Avenue_Picture_20221223105218325_nhfubo.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924797/cc_nr7wjn.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924675/1500heroimage-cb5f25_lfgzcf.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dfgtzibvm/image/upload/v1683924751/Living_2520room_lvo3gg.jpg',
        preview: false
      },


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
