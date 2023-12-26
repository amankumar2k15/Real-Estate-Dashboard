const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { register } = require("../controller/userControllerDashboard")


router.post("/create-user", register)


module.exports = router