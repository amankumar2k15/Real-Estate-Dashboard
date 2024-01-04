const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { register, listUsers, userById, WhoAmI, login } = require("../controller/userControllerDashboard");
const checkSuperAdmin = require('../middleware/superAdmin');
const authenticate = require('../middleware/userRoleAuth');


router.post("/create-user", register)
/*
Super admin routes ===
list users 
search users 
approv users 
reject users 
pagination 
filter 
*/
router.post("/login" , login)
router.get("/list-users", authenticate, checkSuperAdmin, listUsers)
router.get("/", authenticate, checkSuperAdmin, userById)
router.get("/who-am-i", authenticate, WhoAmI)

// router.patch("/:id",  authenticate ,   checkSuperAdmin , userById)



module.exports = router