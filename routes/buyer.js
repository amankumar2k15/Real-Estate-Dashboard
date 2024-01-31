const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { listBuyer, deleteBuyer } = require("../controller/buyers");
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require("../middleware/validate")
const upload = require('../middleware/multer');
const checkSellerAdmin = require('../middleware/sellerAdmin');
const { buyerRegister } = require('../validator/buyer');



router.get("/list-buyer", authenticate, checkSellerAdmin, listBuyer)
router.delete("/delete-buyer/:id", authenticate, deleteBuyer)



module.exports = router