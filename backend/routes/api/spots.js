
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();


router.get('/', async (req, res) => {
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
      avgRating = starSum / reviewCount
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


  res.json({Spots: spots})
})



module.exports = router;