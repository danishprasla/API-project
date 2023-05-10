
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();



router.get('/', async (req, res, next) => {

  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

  let queryErrors = {}
  if (page) {
    if (parseInt(page) <= 10 && parseInt(page) >= 1) {
      page = parseInt(page)
    } else {
      queryErrors.page = "Page must be greater than or equal to 1"
    }
  } else page = 1
  //check if size query exists
  if (size) {
    if (parseInt(size) <= 20 && parseInt(size) >= 1) {
      size = parseInt(size)
    } else {
      queryErrors.size = "Size must be greater than or equal to 1"
    }
  } else size = 20

  if (minLat) {
    if (parseInt(minLat) < -90 || isNaN(parseInt(minLat))) {
      queryErrors.minLat = "Minimum latitude is invalid"
    }
  } else minLat = parseInt(minLat)

  if (maxLat) {
    if (parseInt(maxLat) > 90 || isNaN(parseInt(maxLat))) {
      queryErrors.maxLat = "Maximum latitude is invalid"
    }
  } else maxLat = parseInt(maxLat)

  if (minLng) {
    if (parseInt(minLng) < -180 || isNaN(parseInt(minLng))) {
      queryErrors.minLng = "Minimum longitude is invalid"
    }
  } else minLng = parseInt(minLng)

  if (maxLng) {
    if (parseInt(maxLng) > 180 || isNaN(parseInt(maxLng))) {
      queryErrors.maxLng = "Maximum longitude is invalid"
    }
  } else maxLng = parseInt(maxLng)

  if (minPrice) {
    if (parseInt(minPrice) < 0 || isNaN(parseInt(minPrice))) {
      queryErrors.minPrice = "Minimum price must be greater than or equal to 0"
    }
  } else minPrice = parseInt(minPrice)

  if (maxPrice) {
    if (parseInt(maxPrice) < 0 || isNaN(parseInt(maxPrice))) {
      queryErrors.maxPrice = "Maximum price must be greater than or equal to 0"
    }
  } else maxPrice = parseInt(maxPrice)

  //check if the queryErrors object has been populated -- return err if it has
  if (Object.keys(queryErrors).length >= 1) {
    let err = new Error('Bad Request')
    err.message = "Bad Request"
    err.errors = {
      ...queryErrors
    }
    return next(err)
  }
  let params = {}
  let where = {}

  params.limit = size
  params.offset = size * (page - 1)

  if (maxLat && minLat) {
    where.lat = {
      [Op.between]: [minLat, maxLat]
    }
  } else {
    if (maxLat) {
      where.lat = {
        [Op.lte]: maxLat
      }
    } if (minLat) {
      where.lat = {
        [Op.gte]: minLat
      }
    }
  }

  if (maxLng && minLng) {
    where.lng = {
      [Op.between]: [minLng, maxLng]
    }
  } else {
    if (maxLng) {
      where.lng = {
        [Op.lte]: maxLng
      }
    } if (minLng) {
      where.lng = {
        [Op.gte]: minLng
      }
    }
  }

  if (maxPrice && minPrice) {
    where.price = {
      [Op.between]: [minPrice, maxPrice]
    }
  } else {
    if (maxPrice) {
      where.price = {
        [Op.lte]: maxPrice
      }
    } if (minPrice) {
      where.price = {
        [Op.gte]: minPrice
      }
    }
  }

  const spots = await Spot.findAll({
    where,
    ...params
  })
  //itterate through the array -- spot = obj
  for (let spot of spots) {
    // console.log('spot id: ', spot.id)

    //***SPOT AVG FX BELOW
    //get the review sum through aggregate fx of the stars column
    let starSum = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })
    //get the count of review for each spot
    let reviewCount = await Review.count({
      where: {
        spotId: spot.id
      }
    })
    // console.log('review-sum: ', starSum)
    // console.log('review count', reviewCount)

    //if the sum is null aka, there are no reviews, set the avg rating value to string
    if (starSum === null) {
      // console.log('null test')
      spot.dataValues.avgRating = 'New'
    } else { //set avg rating to the spot obj
      // console.log('review test')
      avgRating = parseFloat((starSum / reviewCount).toFixed(1))
      // console.log('avg', avgRating)
      spot.dataValues.avgRating = avgRating
      // console.log('spot id ----->', spot.id)
    }

    //** GET PREVIEW IMAGE BELOW **
    console.log(spot.id)

    let previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })
    // console.log('preview image', previewImage)

    // console.log(previewImage.url)
    if (!previewImage) {
      spot.dataValues.previewImage = 'This spot does not have a preview image yet'
    } else {
      spot.dataValues.previewImage = previewImage.url
    }
    // console.log(spot)
  }
  res.status(200).json({
    Spots: spots,
    page: page,
    size: size
  })
})



router.get('/current', requireAuth, async (req, res, next) => {
  let userId = req.user.id
  const spots = await Spot.findAll({
    where: {
      ownerId: userId
    }
  })
  for (let spot of spots) {

    //get sum of stars
    let starSum = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })
    //get count of reviews
    let reviewCount = await Review.count({
      where: {
        spotId: spot.id
      }
    })
    if (starSum === null) {
      spot.dataValues.avgRating = 'New'
    } else {
      //set avg rating to the spot obj
      avgRating = parseFloat((starSum / reviewCount).toFixed(1))
      spot.dataValues.avgRating = avgRating
    }

    //find preview image:
    let previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })

    if (!previewImage) {
      spot.dataValues.previewImage = 'This spot does not have a preview image yet'
    } else {
      spot.dataValues.previewImage = previewImage.url
    }

  }
  res.status(200).json({ Spots: spots })
})

router.get('/:spotId', async (req, res, next) => {
  const id = req.params.spotId

  const spot = await Spot.findByPk(id, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  })

  if (!spot) {
    let err = new Error('Spot does not exist')
    err.status = 404
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    next(err)
    // return res.status(404).json({ message: "Spot couldn't be found" })
  }
  const starSum = await Review.sum('stars', {
    where: {
      spotId: id
    }
  })
  const reviewCount = await Review.count({
    where: {
      spotId: id
    }
  })

  if (starSum === null) {
    spot.dataValues.avgStarRating = 'New'
    spot.dataValues.numReviews = 0
  } else {
    //set avg rating to the spot obj
    avgRating = parseFloat((starSum / reviewCount).toFixed(1))
    spot.dataValues.numReviews = reviewCount
    spot.dataValues.avgStarRating = avgRating
  }

  //refactoring below with include statements
  const spotImages = await SpotImage.findAll({
    where: {
      spotId: id
    },
    attributes: ['id', 'url', 'preview']
  })
  // console.log(spotImages)
  spot.dataValues.SpotImages = spotImages


  //add owner info below
  const ownerId = spot.ownerId
  // console.log(ownerId)
  const owner = await User.findByPk(ownerId,
    {
      attributes: ['id', 'firstName', 'lastName']
    })
  spot.dataValues.Owner = owner

  res.status(200).json(spot)

})

//validator for creating a post
const validateSpotPost = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ checkFalsy: true, max: 90, min: -90 })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ checkFalsy: true, max: 180, min: -180 })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be less than 50 characters')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

//creating a post - require auth, post created for whoever is logged in
router.post('/', [requireAuth, validateSpotPost], async (req, res, next) => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body
  let id = req.user.id
  const spot = await Spot.create(
    {
      ownerId: id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }
  )
  res.status(201).json(spot)
})


const validateSpotImagePost = [
  check('url')
    .exists({ checkFalsy: true })
    .isURL({ checkFalsy: true })
    .withMessage('Invalid URL'),
  check('preview')
    .exists()
    .isBoolean({ checkFalsy: true })
    .withMessage('Please enter true or false'),
  handleValidationErrors
];

//post a spot image
router.post('/:spotId/images', [requireAuth, validateSpotImagePost], async (req, res, next) => {

  const { url, preview } = req.body
  let userId = req.user.id
  let spotId = req.params.spotId
  let spot = await Spot.findByPk(spotId)
  if (!spot) {
    let err = new Error('Spot does not exist')
    err.status = 404
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    next(err)
  } else if (spot.ownerId !== userId) {
    let err = new Error('Spot does not belong to you')
    err.status = 403
    err.title = 'Forbidden'
    err.message = "The spot does not belong to you"
    next(err)
  } else {
    const spotImage = await SpotImage.create({
      spotId: spotId,
      url,
      preview
    })
    console.log('back end for creating spot image -->',spotImage)
    return res.status(200).json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview
    })
  }
})

//edit a spot id
router.put('/:spotId', [requireAuth, validateSpotPost], async (req, res, next) => {

  const { address, city, state, country, lat, lng, name, description, price } = req.body

  let userId = req.user.id
  let spotId = req.params.spotId
  let spot = await Spot.findByPk(spotId)

  //check if spot exists based off id
  if (!spot) {
    let err = new Error('Spot does not exist')
    err.status = 404
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    return next(err)
  } else if (spot.ownerId !== userId) { //check if spot belongs to logged in user
    let err = new Error('Spot does not belong to you')
    err.status = 403
    err.title = 'Forbidden'
    err.message = "The spot does not belong to you"
    return next(err)
  }

  if (address) spot.address = address
  if (city) spot.city = city
  if (state) spot.state = state
  if (country) spot.country = country
  if (lat) spot.lat = lat
  if (lng) spot.lng = lng
  if (name) spot.name = name
  if (description) spot.description = description
  if (price) spot.price = price

  await spot.save()
  res.status(200).json(spot)
})

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {

  let userId = req.user.id
  let spotId = req.params.spotId
  let spot = await Spot.findByPk(spotId)

  //check if spot exists based off id
  if (!spot) {
    let err = new Error('Spot does not exist')
    err.status = 404
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    return next(err)
  } else if (spot.ownerId !== userId) { //check if spot belongs to logged in user
    let err = new Error('Spot does not belong to you')
    err.status = 403
    err.title = 'Forbidden'
    err.message = "The spot does not belong to you"
    return next(err)
  } else {
    await spot.destroy()
    res.status(200).json({ message: 'Successfully deleted' })
  }
})

//get reviews based on spotId
router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId
  const spot = await Spot.findByPk(spotId)

  console.log(spot)
  if (!spot) {
    let err = new Error("Spot couldn't be found")
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    err.status = 404
    return next(err)
  }

  const reviews = await Review.findAll({
    where: {
      spotId: spot.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })
  res.status(200).json({Reviews: reviews})
})

//validate review 
const validateComment = [
  check('review')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ checkFalsy: true, max: 5, min: 1 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//make a review post
router.post('/:spotId/reviews', [requireAuth, validateComment], async (req, res, next) => {
  let userId = req.user.id
  let spotId = req.params.spotId
  let spot = await Spot.findByPk(spotId)
  const { review, stars } = req.body

  //check to see if a review exists already for the spot made by the user
  //null if it doesnt exist
  const reviewCheck = await Review.findAll({
    where: {
      userId: userId,
      spotId: spotId
    }
  })
  console.log(reviewCheck)

  //check if spot exists based off id
  if (!spot) {
    let err = new Error('Spot does not exist')
    err.status = 404
    err.title = 'Spot not found'
    err.message = "Spot couldn't be found"
    return next(err)
  }
  //check if variable is true
  else if (reviewCheck.length >= 1) {
    let err = new Error('Review for this spot already exists')
    err.title = 'User already has a review for this spot'
    err.message = 'User already has a review for this spot'
    return next(err)
  }
  //check if the user is trying to make a review for a spot they own
  //err if true
  else if (spot.ownerId == userId) {
    let err = new Error("You cant submit a review for your own spot")
    err.status = 404
    err.title = "You can not submit a review for a spot you own"
    err.message = "You can not submit a review for a spot you own"
    return next(err)
  }
  //if no errors, post the review
  else {
    const reviewPost = await Review.create({
      userId: userId,
      spotId: parseInt(spotId),
      review,
      stars
    })
    res.status(201).json(reviewPost)
  }
})

//get bookings based off spot id

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  let userId = req.user.id
  let spotId = req.params.spotId
  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  //check if spot exists
  if (!spot) {
    let err = new Error('Spot not found')
    err.status = 404
    err.title = "Spot couldn't be found"
    err.message = "Spot couldn't be found"
    return next(err)
  }

  if (spot.ownerId !== userId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    //Change the format of the startDate and endDate below
    for (let booking of bookings) {
      let startDateRaw = booking.startDate
      let endDateRaw = booking.endDate
      let startDate = startDateRaw.toJSON().split('T')[0]
      let endDate = endDateRaw.toJSON().split('T')[0]

      booking.dataValues.startDate = startDate
      booking.dataValues.endDate = endDate
    }

    res.status(200).json({ Bookings: bookings })
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    })
    for (let booking of bookings) {
      let startDateRaw = booking.startDate
      let endDateRaw = booking.endDate
      let startDate = startDateRaw.toJSON().split('T')[0]
      let endDate = endDateRaw.toJSON().split('T')[0]

      booking.dataValues.startDate = startDate
      booking.dataValues.endDate = endDate
    }

    res.status(200).json({ Bookings: bookings })
  }
})

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Invalid date format. Must be YYYY-MM-DD')
    .isISO8601()
    .withMessage('Invalid date format. Must be YYYY-MM-DD'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('Invalid date format. Must be YYYY-MM-DD')
    .isISO8601()
    .withMessage('Invalid date format. Must be YYYY-MM-DD'),
  handleValidationErrors
];

router.post('/:spotId/bookings', [requireAuth, validateBooking], async (req, res, next) => {
  const { startDate, endDate } = req.body
  const userId = req.user.id
  const spotId = req.params.spotId

  let startDateRaw = new Date(startDate)
  let endDateRaw = new Date(endDate)

  let spot = await Spot.findByPk(spotId)

  //check if spot exists
  if (!spot) {
    let err = new Error('Spot not found')
    err.message = "Spot couldn't be found"
    err.title = "Spot couldn't be found"
    err.status = 404
    return next(err)
  }
  if (spot.ownerId === userId) {
    let err = new Error('Bad request')
    err.status = 400
    err.message = 'You cannot create a booking for a spot you own.'
    err.title = 'You cannot create a booking for a spot you own.'
    return next(err)
  }
  //get the current date
  let currDate = new Date();
  let currDateRaw = (new Date((currDate).toDateString())).getTime()


  if (startDateRaw.getTime() < currDateRaw || endDateRaw.getTime() < currDateRaw) {
    let err = new Error('Bad request')
    err.status = 400
    err.message = "Cannot create a booking for past days"
    err.title = "Cannot create a booking for past days"
    return next(err)
  }


  //get all current bookings for the spot
  const bookings = await Booking.findAll({
    where: {
      spotId: spotId
    }
  })

  if (startDateRaw.getTime() >= endDateRaw.getTime()) {
    let err = new Error('Bad request')
    err.status = 400
    err.message = 'End date cannot be on or before the start date'
    err.errors = {
      endDate: "endDate cannot be on or before startDate"
    }
    return next(err)
  }

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

  let newBooking = await Booking.create({
    userId: userId,
    spotId: parseInt(spotId),
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  })

  //adjust to yyyy-mm-dd format
  let startDateAdj = newBooking.startDate
  let endDateAdj = newBooking.endDate
  let adjStartDate = startDateAdj.toJSON().split('T')[0]
  let adjEndDate = endDateAdj.toJSON().split('T')[0]

  newBooking.dataValues.startDate = adjStartDate
  newBooking.dataValues.endDate = adjEndDate

  res.status(200).json(newBooking)
})


module.exports = router;