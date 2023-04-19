const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  let userId = req.user.id

  const userInfo = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName
  }

  // console.log(userInfo)

  const reviews = await Review.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['updatedAt', 'createdAt', 'description']
        }
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })
  if (!reviews) return res.status(200).res.json({message: "This user currently does not have any reviews"})
  //add preview image property onto the Spot obj in the review obj
  for (let review of reviews) {
    //get the spotId and search SpotImage.findOne with id
    let spotId = review.Spot.id
    // console.log(spotId)
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spotId,
        preview: true
      }
    })
    //if there is no preview image
    if (!previewImage) {
      review.dataValues.Spot.dataValues.previewImage = 'This spot does not have a preview image'
    } else { //if there is a preview image
      review.dataValues.Spot.dataValues.previewImage = previewImage.url
    }
    console.log(review)
  }
  res.status(200).json({ Reviews: reviews })
})



module.exports = router;