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
  //itterate through bookings to add the preview image
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


    booking.dataValues.startDate = startDate
    booking.dataValues.endDate = endDate

  }

  res.status(200).json({ Bookings: bookings })
})


const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format. Must be YYYY-MM-DD'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format. Must be YYYY-MM-DD'),
  handleValidationErrors
]
//edit a booking

router.put('/:bookingId', [requireAuth, validateBooking], async (req, res, next) => {
  let userId = req.user.id
  let bookingId = req.params.bookingId
  const { startDate, endDate } = req.body

  let userBooking = await Booking.findByPk(bookingId)

  //check if booking exists
  if (!userBooking) {
    let err = new Error('Booking not found')
    err.status = 400
    err.message = "Booking couldn't be found"
    err.title = "Booking couldn't be found"
    return next(err)
  }
  //check if booking belongs to current logged in user
  if (userBooking.userId !== userId) {
    let err = new Error('Bad Request')
    err.message = 'Booking does not belong to you'
    err.title = 'Booking does not belong to you'
    err.status = 400
    return next(err)
  }

  let startDateRaw = new Date(startDate)
  let endDateRaw = new Date(endDate)

  let currDate = new Date();
  let currDateRaw = (new Date((currDate).toDateString())).getTime()

  //check if edit values are set to a time before current time
  if (startDateRaw.getTime() < currDateRaw || endDateRaw.getTime() < currDateRaw) {
    let err = new Error('Bad request')
    err.status = 403
    err.message = "Past bookings can't be modified"
    err.title = "Past bookings can't be modified"
    return next(err)
  }
  //check if start date is after end date
  if (startDateRaw.getTime() >= endDateRaw.getTime()) {
    let err = new Error('Bad request')
    err.status = 400
    err.message = 'End date cannot be on or before the start date'
    err.errors = {
      endDate: "endDate cannot be on or before startDate"
    }
    return next(err)
  }

  let spotId = userBooking.spotId
  //get all bookings for the spot EXCLUDING the current booking you're editing
  const bookings = await Booking.findAll({
    where: {
      spotId: spotId,
      //do not include the booking that is being edited in this result
      id: {
        [Op.ne]: bookingId
      }
    }
  })

  //check if there are conflicting bookings
  for (let booking of bookings) {

    //this is getting the dates for the bookings, "removing" the time and converting to a string then getting a new Date value based off the output then finally calling the .getTime method to convert it to a integer to compare 

    let startDate = (new Date((booking.startDate).toDateString())).getTime()
    let endDate = (new Date((booking.endDate).toDateString())).getTime()

    //conditional checking if the start date falls between an already existing booking

    let errorObj = {}

    if (startDateRaw.getTime() >= startDate && startDateRaw.getTime() <= endDate) {
      errorObj.startDate = "Start date conflicts with an existing booking"
    }

    //checking if the startdate falls between an already existing booking
    if (endDateRaw.getTime() >= startDate && endDateRaw.getTime() <= endDate) {
      errorObj.endDate = "End date conflicts with an existing booking"
    }
    //check if key(s) inside errorObj  exist -- if true, it means at least one of the above 2 errors were hit --> end op with error
    if (Object.keys(errorObj).length >= 1) {
      let err = new Error('Booking conflict')
      err.message = 'Sorry this spot is already booked for the specified date(s)'
      err.title = 'Booking Conflict'
      err.status = 403
      err.errors = {
        ...errorObj
      }
      return next(err)
    }
  }

  //if no errors met update booking:

  if (startDate) userBooking.startDate = new Date(startDate)
  if (endDate) userBooking.endDate = new Date(endDate)

  await userBooking.save()

  //adjust to yyyy-mm-dd format
  let startDateAdj = userBooking.startDate
  let endDateAdj = userBooking.endDate
  let adjStartDate = startDateAdj.toJSON().split('T')[0]
  let adjEndDate = endDateAdj.toJSON().split('T')[0]

  userBooking.dataValues.startDate = adjStartDate
  userBooking.dataValues.endDate = adjEndDate

  res.status(200).json(userBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const userId = req.user.id
  const bookingId = req.params.bookingId
  const userBooking = await Booking.findByPk(bookingId)

  if (!userBooking) {
    let err = new Error('Booking not found')
    err.status = 404
    err.message = "Booking couldn't be found"
    err.title = "Booking couldn't be found"
    return next(err)
  }

  if (userBooking.userId !== userId) {
    let err = new Error('Bad Request')
    err.message = 'Booking does not belong to you'
    err.title = 'Booking does not belong to you'
    err.status = 400
    return next(err)
  }

  let currDate = new Date();
  let currDateRaw = (new Date((currDate).toDateString())).getTime()

  let startDateRaw = (new Date((userBooking.startDate).toDateString())).getTime()
  // let endDateRaw = (new Date((userBooking.endDate).toDateString())).getTime()

  if (startDateRaw < currDateRaw) {
    let err = new Error('Invalid request')
    err.status = 403
    err.message = "Bookings that have been started can't be deleted"
    err.title = "Bookings that have been started can't be deleted"
    return next(err)
  }

  await userBooking.destroy()
  res.status(200).json({ message: "Successfully deleted" })
})
module.exports = router;