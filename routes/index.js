const express = require("express")
const router = express.Router()

const userRoute = require('./user')
const authRoute = require('./auth')


router.use("/user", userRoute)
router.use("/auth", authRoute);

module.exports = router