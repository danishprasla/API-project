const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();


//get booking for current user
router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id
  const bookings = await Booking.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        }
      }
    ],
  })

  if (!bookings) {
    let err = new Error('User has no bookings')
    err.title = 'User has no bookings'
    err.message = 'User has no bookings'
    err.status = 404
    return next(err)
  }
  for (let booking of bookings) {
    let spotId = booking.spotId
    // console.log(spotId)
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spotId,
        preview: true
      }
    })
    //if there is no preview image
    if (!previewImage) {
      booking.dataValues.Spot.dataValues.previewImage = 'This spot does not have a preview image'
    } else { //if there is a preview image
      booking.dataValues.Spot.dataValues.previewImage = previewImage.url
    }

    //start date split to return YYYY-MM-DD
    let startDateRaw = booking.startDate
    let endDateRaw = booking.endDate
    let startDate = startDateRaw.toJSON().split('T')[0]
    let endDate = endDateRaw.toJSON().split('T')[0]

    // createdDate = (booking.createdAt).toUTCString()
    // console.log(createdDate)

    booking.dataValues.startDate = startDate
    booking.dataValues.endDate = endDate

  }

  res.status(200).json({Bookings: bookings})
})


// const date = new Date();
// const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit', second:'2-digit' };
// const formattedDate = date.toLocaleString('en-US', options).replace(',', '');

// console.log(formattedDate);

module.exports = router;