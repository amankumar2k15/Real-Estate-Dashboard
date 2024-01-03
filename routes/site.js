const express = require('express');
const router = express.Router()

const { siteRegister , listSite } = require("../controller/siteController");
const checkSellerAdmin = require('../middleware/sellerAdmin');
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const { siteRegisterValidator  } = require("../validator/site")
const upload = require('../middleware/multer');


router.post("/create-site",upload.array('flat_images', 5) , validate(siteRegisterValidator), siteRegister)


router.get("/list-site", listSite)



module.exports = router