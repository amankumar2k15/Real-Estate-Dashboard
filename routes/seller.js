const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { sellerRegistration} = require("../controller/sellorController");
const checkSuperAdmin = require('../middleware/superAdmin');
const authenticate = require('../middleware/userRoleAuth');


router.post("/create-seller",authenticate ,checkSuperAdmin , sellerRegistration)
/*
Super admin routes ===
list users 
search users 
approv users 
reject users 
pagination 
filter 
*/
// router.get("/list-users",  authenticate ,   checkSuperAdmin , listUsers)
// router.get("/",  authenticate ,   checkSuperAdmin , userById)
// router.patch("/:id",  authenticate ,   checkSuperAdmin , userById)



module.exports = router