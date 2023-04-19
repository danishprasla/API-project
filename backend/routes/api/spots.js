
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();


router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({

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
      spot.dataValues.avgRating = 'This location does not have any reviews'
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
  res.status(200).json({ Spots: spots })
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
      spot.dataValues.avgRating = 'This location does not have any reviews'
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
    spot.dataValues.avgRating = 'This location does not have any reviews'
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
    .isLength({ min: 3 })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
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
    .exists({ checkFalsy: true })
    .isBoolean({ checkFalsy: true })
    .withMessage('Please enter true or false'),
  handleValidationErrors
];

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
    next(err)
  } else if (spot.ownerId !== userId) { //check if spot belongs to logged in user
    let err = new Error('Spot does not belong to you')
    err.status = 403
    err.title = 'Forbidden'
    err.message = "The spot does not belong to you"
    next(err)
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
    next(err)
  } else if (spot.ownerId !== userId) { //check if spot belongs to logged in user
    let err = new Error('Spot does not belong to you')
    err.status = 403
    err.title = 'Forbidden'
    err.message = "The spot does not belong to you"
    next(err)
  } else {
    await spot.destroy()
    res.status(200).json({ message: 'Successfully deleted' })
  }
})

module.exports = router;