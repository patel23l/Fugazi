const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./data_models/user')

// Create a passport middleware to handle user registration
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const userExists = await UserModel.findOne({ email }).exec()
    if (userExists) {
      return done(null, false, { message: 'User already exists', code: 409 })
    }

    const user = await UserModel.create({ email, password, name: req.body.name }) // TODO(vidursatija): add email support
    // Send the user information to the next middleware
    return done(null, user)
  } catch (error) {
    return done(error, false, { message: error, code: 500 })
  }
}))

// Create a passport middleware to handle User login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      return done(null, false, { message: 'User not found', code: 401 })
    }

    const validate = await user.isValidPassword(password)
    if (!validate) {
      return done(null, false, { message: 'Wrong Password', code: 401 })
    }

    return done(null, user, { message: 'Logged in Successfully', code: 200 })
  } catch (error) {
    return done(error, false, { message: error, code: 500 })
  }
}))

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const cookieExtractor = function (req) {
  let token = null
  token = ExtractJWT.fromAuthHeaderAsBearerToken()(req)
  if (req && req.cookies) {
    token = req.cookies.access_token
  }
  return token
}

passport.use(new JWTstrategy({
  secretOrKey: Buffer.from(process.env.JWT_AUTH_KEY, 'base64'),
  jwtFromRequest: cookieExtractor,
  passReqToCallback: true
}, async (info, token, done) => {
  try {
    // const isAllowed = info.allowedRoles.indexOf(token.user.role) > -1;

    // if(!isAllowed) {
    //   return done(null, false);
    // }

    return done(null, token.user)
  } catch (error) {
    done(error)
  }
}))
