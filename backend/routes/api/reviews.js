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
  if (!reviews) return res.status(200).res.json({ message: "This user currently does not have any reviews" })
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
    // console.log(review)
  }
  res.status(200).json({ Reviews: reviews })
})

const validateReviewImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Must submit a valid url for the image')
    .isURL({ checkFalsy: true })
    .withMessage('Must submit a valid url for the image'),
  handleValidationErrors
];

//add image to a review based on review's id
router.post('/:reviewId/images', [requireAuth, validateReviewImage], async (req, res, next) => {
  const userId = req.user.id
  const reviewId = req.params.reviewId
  const review = await Review.findByPk(reviewId)

  //to get the images that already belong to a review
  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId
    }
  })

  const { url } = req.body
//check if the review id exists
  if (!review) {
    let err = new Error('Review not found')
    err.title = "Review couldn't be found"
    err.message = "Review couldn't be found"
    err.status = 404
    return next(err)
  }
  //check if the review belogns to someone else
  else if (review.userId !== userId) {
    let err = new Error('Cannot edit a review belonging to someone else')
    err.status = 404
    err.message = "Cannot edit a review belonging to someone else"
    err.title = "Cannot edit a review belonging to someone else"
    return next(err)
  }
//check if the amount of images on the review -- if 10 or more, then don't submit the image
  else if (reviewImages.length >= 10) {
    let err = new Error('Maximum amount of images reached')
    err.status = 403
    err.title = 'Maximum number of images for this resource was reached'
    err.message = 'Maximum number of images for this resource was reached'
    return next(err)
  }
//if no errors, submit the image onto the review
  else {
    let reviewImage = await ReviewImage.create({
      reviewId: parseInt(reviewId),
      url
    })
    res.status(200).json({
      id: reviewImage.id,
      url: reviewImage.url
    })
  }
})


module.exports = router;