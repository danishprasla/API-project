
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
      // console.log(spot)
    }

    //** GET PREVIEW IMAGE BELOW **/

    let previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })
    // console.log(previewImage.url)
    spot.dataValues.previewImage = previewImage.url
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
    spot.dataValues.previewImage = previewImage.url

  }
  res.status(200).json({ Spots: spots })
})

router.get('/:id', async (req, res, next) => {
  const id = req.params.id

  const spot = await Spot.findByPk(id)

  if (!spot) {
    // let err = new Error('Spot does not exist')
    // err.status = 404
    // err.title = 'Spot not found'
    // err.message = "Spot couldn't be found"
    // next(err)
    return res.status(404).json({ message: "Spot couldn't be found" })
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
  // let ownerObj = {
  //   id: ownerId,
  //   firstName: owner.firstName,
  //   lastName: owner.lastName
  // }
  // console.log(ownerObj)
  spot.dataValues.Owner = owner

  res.status(200).json(spot)

})


module.exports = router;