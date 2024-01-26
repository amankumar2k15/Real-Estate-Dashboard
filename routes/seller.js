const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { sellerRegistration } = require("../controller/sellorController");
const {deleteSeller, sellerById , listSeller} = require("../controller/seller");

const checkSuperAdmin = require('../middleware/superAdmin');
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const { sellerRegister } = require("../validator/seller")
const upload = require('../middleware/multer');

router.get("/list-seller", authenticate, checkSuperAdmin, listSeller)

router.get("/:id", authenticate, checkSuperAdmin, sellerById)
router.delete("/delete-seller/:id", authenticate, checkSuperAdmin, deleteSeller)
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