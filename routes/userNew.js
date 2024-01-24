const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const authenticate = require('../middleware/userRoleAuth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/multer');

// const { register, login, generateOtpForPasswordReset, resetPassword , listUsers , userById , WhoAmI , getDashbardData } = require("../controller/userControllerDashboard");
const { register, login, generateOtpForPasswordReset, resetPassword, listUsers, userById, WhoAmI, getDashbardData } = require("../controller/user");
const checkSuperAdmin = require('../middleware/superAdmin')
const { resetPasswordUser, registerValidator, loginValidator } = require('../validator/user');
const { error } = require('../helper/baseResponse');

router.post("/create-user", authenticate, upload.fields([
    { name: 'adhaar', maxCount: 1 },
    { name: 'companyPan', maxCount: 1 },
    { name: 'certificate_of_incorporate', maxCount: 1 },
    { name: 'individualPan', maxCount: 1 },
    { name: 'blankCheque', maxCount: 1 },
    { name: 'source_of_fund', maxCount: 1 },
    { name: 'profile', maxCount: 1 },
]), register);

router.post("/login", validate(loginValidator), login);
// router.post("/login", login);

router.post("/generate-otp", generateOtpForPasswordReset);
router.post("/reset-password", validate(resetPasswordUser), resetPassword);

router.get("/list-users", authenticate, checkSuperAdmin, listUsers)
router.get("/", authenticate, checkSuperAdmin, userById)
router.get("/who-am-i", authenticate, WhoAmI)
router.get("/dashboard", authenticate, getDashbardData)
router.patch("/:id", authenticate, checkSuperAdmin, userById)



module.exports = router