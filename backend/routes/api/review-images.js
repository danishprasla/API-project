const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const userId = req.user.id
  const imageId = req.params.imageId

  const image = await ReviewImage.findByPk(imageId)

  if(!image) {
    let err = new Error ('Image not found')
    err.status = 404
    err.message = "Review Image couldn't be found"
    err.title = "Review Image couldn't be found"
    return next (err)
  }

  const reviewId = image.reviewId

  const review = await Review.findByPk(reviewId)

  if (review.userId !== userId) {
    let err = new Error('Not authorized to remove an image belonging to another user')
    err.status = 401
    err.message = "Not authorized to remove an image belonging to another user"
    err.title = "Not authorized to remove an image belonging to another user"
    return next(err)
  }
  await image.destroy()

  res.json({ message: "Successfully deleted" })
})

module.exports = router;