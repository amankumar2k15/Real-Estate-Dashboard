const express = require("express")
const router = express.Router()

const userRoute = require('./userNew')
const authRoute = require('./auth')
const sellerRoute = require('./seller')
const buyerRoute = require('./buyer')
const siteRoutes = require('./site')


router.use("/user", userRoute)
router.use("/auth", authRoute);
router.use("/seller", sellerRoute);
router.use("/buyer", buyerRoute);
router.use("/site", siteRoutes);




module.exports = router