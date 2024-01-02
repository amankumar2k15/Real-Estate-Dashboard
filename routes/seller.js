const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { sellerRegistration, listSeller, deleteSeller } = require("../controller/sellorController");
const checkSuperAdmin = require('../middleware/superAdmin');
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const { sellerRegister } = require("../validator/seller")
const upload = require('../middleware/multer');


router.post("/create-seller", authenticate, checkSuperAdmin, upload.fields([
    { name: 'adhaar', maxCount: 1 },
    { name: 'companyPan', maxCount: 1 },
    { name: 'blankCheque', maxCount: 1 },
    { name: 'certificate_of_incorporate', maxCount: 1 },
]), validate(sellerRegister), sellerRegistration)
router.get("/list-seller", authenticate, checkSuperAdmin, listSeller)
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