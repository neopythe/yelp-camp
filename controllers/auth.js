const User = require('../models/user')

const catchAsync = require('../util/catchAsync')

module.exports.renderRegistrationForm = (req, res) => {
  res.render('auth/register')
}

module.exports.register = catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)

    req.login(registeredUser, err => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'Welcome to YelpCamp!')
      res.redirect('/campgrounds')
    })
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/register')
  }
})

module.exports.renderLoginForm = (req, res) => {
  res.render('auth/login')
}

module.exports.login = (req, res) => {
  // ensure that "keepSessionInfo: true" is set on the login route for passport v0.6.0+
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo
  req.flash('success', 'Welcome back!')
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.flash('success', 'See you later!')
    res.redirect('/')
  })
}
