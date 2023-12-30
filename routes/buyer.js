const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { buyerRegistration, listBuyer } = require("../controller/buyerController");
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const upload = require('../middleware/multer');
const checkSellerAdmin = require('../middleware/sellerAdmin');
const { buyerRegister } = require('../validator/buyer');


router.post("/create-buyer", authenticate, upload.fields([
    { name: 'adhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'blankCheque', maxCount: 1 },
    { name: 'source_of_fund', maxCount: 1 },
]), validate(buyerRegister), buyerRegistration)

router.get("/list-buyer", authenticate, listBuyer)
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