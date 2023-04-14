const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth'); //importing authorization fx
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { credential, password } = req.body
  const user = await User.unscoped().findOne({ //removing the default scope
    where: {
      [Op.or]: { //returning one if the username OR the email matches the credential
        username: credential,
        email: credential
      }
    }
  })
  // console.log('hashed pw', user.hashedPassword);

  //if user is null aka no user found OR the hashed version off the input pass word doesnt match the stored HashedPassword (retrieved from the user obj)
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = {
      credential: 'The provided credentials were invalid.'
    }
   
    return next(err)
  }
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username
  }

  await setTokenCookie(res, safeUser) //setting the token when user logs in named 'token'

  return res.json({
    user: safeUser
  })
})


//code to test above route
// fetch('/api/session', {
//   method: 'POST',
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": "2raIwm0K-KklVxI5Pv6JMwc0VwVTd--qSiWg"
//   },
//   body: JSON.stringify({ credential: 'demo@user.io', password: 'Hello World!' })
// }).then(res => res.json()).then(data => console.log(data));

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({message: 'success'})
})


//restore session user
router.get('/', async (req, res) => {
  const {user} = req;
  if(user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser
    });
  } else return res.json({user: null})
})




module.exports = router; 