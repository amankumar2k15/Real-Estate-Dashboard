const express = require('express');
const router = express.Router()

const { siteRegister, listSite } = require("../controller/siteController");
const checkSellerAdmin = require('../middleware/sellerAdmin');
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const { siteRegisterValidator } = require("../validator/site")
const upload = require('../middleware/multer');


router.post("/create-site",  authenticate ,  upload.single("site_image"), validate(siteRegisterValidator), siteRegister)


// router.post("/create-seller", authenticate, checkSuperAdmin, upload.fields([
//     { name: 'adhaar', maxCount: 1 },
//     { name: 'companyPan', maxCount: 1 },
//     { name: 'blankCheque', maxCount: 1 },
//     { name: 'certificate_of_incorporate', maxCount: 1 },
// ]), validate(sellerRegister), sellerRegistration)


router.get("/list-site", listSite)



module.exports = router