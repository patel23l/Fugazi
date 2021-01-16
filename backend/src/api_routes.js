const express = require('express')
const authRoutes = require('./auth_routes')
const videoRoutes = require('./video_routes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/video', videoRoutes)

module.exports = router
