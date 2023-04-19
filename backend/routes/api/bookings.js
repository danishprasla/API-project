const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();



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

  
  res.json(bookings)
})

module.exports = router;