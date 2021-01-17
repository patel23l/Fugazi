const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()

// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
router.post('/signup', async (req, res, next) => {
  passport.authenticate('signup', { session: false }, async (err, user, info) => {
    // console.log(err, user, info);
    if (err || !user) {
      if (info.code !== 500) { return res.status(info.code).json(info) } else { return next(err) }
    }

    const body = {
      email: user.email,
      displayName: user.name
    }

    res.json({
      message: 'Signup successful',
      userData: body
    })
  })(req, res, next)
})

router.post('/login', async (req, res, next) => {
  // console.log(req.body);
  passport.authenticate('login', async (err, user, info) => {
    if (err || !user) {
      // console.log(info.code, err, user);
      if (info.code !== 500) { return res.status(info.code).json(info) } else { return next(err) }
    }

    try {
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)
        const body = {
          email: user.email,
          displayName: user.name
        }

        // TODO(vidursatija): Change secret
        const token = jwt.sign({ user: body }, Buffer.from(process.env.JWT_AUTH_KEY, 'base64'))
        body.profilePicture = user.profilePicture
        return res.cookie('access_token', token, { expires: new Date(Date.now() + 3600 * 1000 * 24), httpOnly: true, secure: false }).json({ access_token: token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

router.post('/logout', async (req, res, next) => {
  // req.allowedRoles = [];
  passport.authenticate('jwt', { session: false }, async (_, user) => {
    return res.clearCookie('access_token').json({ status: true })
  })(req, res, next)
})

router.post('/verify', async (req, res, next) => {
  // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
  passport.authenticate('jwt', { session: false }, async (error, user) => {
    if (user) return res.json({ status: true })
    else return next(error)
  })(req, res, next)
})

module.exports = router
