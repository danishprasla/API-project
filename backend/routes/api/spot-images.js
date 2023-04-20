const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  let userId = req.user.id
  let imageId = req.params.imageId

  let image = await SpotImage.findByPk(imageId)

  if(!image) {
    let err = new Error ('Image not found')
    err.status = 404
    err.message = "Spot Image couldn't be found"
    err.title = "Spot Image couldn't be found"
    return next (err)
  }
  // console.log(image)

  let spotId = image.spotId

  let spot = await Spot.findByPk(spotId)

  if(spot.ownerId !== userId) {
    let err = new Error ('Not authorized to remove an image belonging to another user')
    err.status = 401
    err.message = "Not authorized to remove an image belonging to another user"
    err.title = "Not authorized to remove an image belonging to another user"
    return next (err)
  }

  await image.destroy()
  res.json('Successfully deleted')

})



module.exports = router;