const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('../controllers/auth')

router.route('/register').get(auth.renderRegistrationForm).post(auth.register)

router
  .route('/login')
  .get(auth.renderLoginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      keepSessionInfo: true,
    }),
    auth.login
  )

router.post('/logout', auth.logout)

module.exports = router
