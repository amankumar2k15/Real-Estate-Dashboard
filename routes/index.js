const express = require("express")
const router = express.Router()

const userRoute = require('./user')
const authRoute = require('./auth')
const sellerRoute = require('./seller')


router.use("/user", userRoute)
router.use("/auth", authRoute);
router.use("/seller", sellerRoute);


module.exports = router