const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const { register, login , generateOtpForPasswordReset ,  resetPassword  } = require("../controller/user");
const checkSuperAdmin = require('../middleware/superAdmin');
const authenticate = require('../middleware/userRoleAuth');
const { validate } = require('../middleware/validate');
const { resetPasswordUser, registerValidator, loginValidator } = require('../validator/user');


router.post("/create-user", validate(registerValidator) , register)

router.post("/login" ,validate(loginValidator) , login);
router.post("/generate-otp" , generateOtpForPasswordReset)
router.post("/reset-password" , validate(resetPasswordUser) , resetPassword)


// router.get("/list-users", authenticate, checkSuperAdmin, listUsers)
// router.get("/", authenticate, checkSuperAdmin, userById)
// router.get("/who-am-i", authenticate, WhoAmI)
// router.get("/dashboard", authenticate, getDashbardData)


// router.patch("/:id",  authenticate ,   checkSuperAdmin , userById)



module.exports = router