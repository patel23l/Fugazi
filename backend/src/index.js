require('dotenv').config()
// const { resolve } = require('path')
// const history = require('connect-history-api-fallback')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const compression = require('compression')
const helmet = require('helmet')

const app = express()
require('express-ws')(app)

const PORT = process.env.PORT

// Static UI
// const publicPath = resolve(__dirname, '../dist')
// const staticConf = { maxAge: '1y', etag: false }
// const staticMiddleware = express.static(publicPath, staticConf)

// Passport auth setup
require('./passport_auth.js')

// Add API routes
const apiRoutes = require('./api_routes')

const morganMode = (process.env.NODE_ENV === 'production') ? 'tiny' : 'dev'

// Express middleware
app.use(compression())
app.use(morgan(morganMode)) // logging
app.use(helmet()) // security
app.use(cors()) // restrict cross origin
app.use(cookieParser()) // parse cookies into request
app.use(bodyParser.urlencoded({ extended: false })) // parse x-www-url-formencoded
app.use(bodyParser.json())
app.use('/api', apiRoutes) // all API routes #TODO
// app.use(history()) // Single page application support -> redirect to index.html
// app.use(staticMiddleware)

// Go
app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
