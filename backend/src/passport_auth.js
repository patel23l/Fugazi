const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const client = require('./db')
const bcrypt = require('bcrypt')

// Create a passport middleware to handle user registration
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    let userRow = await client.query("SELECT email FROM userSchema WHERE email=$1::text;", [email]);
    console.log(userRow.rows);
    if (userRow.rowCount == 1) {
      return done(null, false, { message: 'User already exists', code: 409 })
    }

    const newPassword = await bcrypt.hash(password, 10);
    userRow = await client.query("INSERT INTO userSchema (email, password, name) VALUES ($1::text, $2::text, $3::text);", [email, newPassword, req.body.name]);
    // Send the user information to the next middleware
    const user = {
      email,
      "name": req.body.name
    }
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error, false, { message: error, code: 500 })
  }
}))

// // Create a passport middleware to handle User login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    console.log(email, password);
    let userRow = await client.query("SELECT * FROM userSchema WHERE email=$1::text;", [email]);
    console.log(userRow.rows);
    if (userRow.rowCount == 0) {
      return done(null, false, { message: 'User not found', code: 401 })
    }

    const validate = await bcrypt.compare(password, userRow.rows[0].password)
    if (!validate) {
      return done(null, false, { message: 'Wrong Password', code: 401 })
    }

    return done(null, userRow.rows[0], { message: 'Logged in Successfully', code: 200 })
  } catch (error) {
    return done(error, false, { message: error, code: 500 })
  }
}))

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const cookieExtractor = function (req) {
  let token = null
  token = ExtractJWT.fromAuthHeaderAsBearerToken()(req)
  // if (req && req.cookies) {
  //   token = req.cookies.access_token
  // }
  return token
}

passport.use(new JWTstrategy({
  secretOrKey: Buffer.from(process.env.JWT_AUTH_KEY, 'base64'),
  jwtFromRequest: cookieExtractor,
  passReqToCallback: true
}, async (info, token, done) => {
  try {

    return done(null, token.user)
  } catch (error) {
    done(error)
  }
}))
