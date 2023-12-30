const express = require("express")
const router = express.Router()

const userRoute = require('./user')
const authRoute = require('./auth')
const sellerRoute = require('./seller')
const buyerRoute = require('./buyer')


router.use("/user", userRoute)
router.use("/auth", authRoute);
router.use("/seller", sellerRoute);
router.use("/buyer", buyerRoute);



module.exports = router