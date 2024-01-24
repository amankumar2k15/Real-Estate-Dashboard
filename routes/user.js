const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router()

const authenticate = require('../middleware/userRoleAuth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/multer');

const { register, login, generateOtpForPasswordReset, resetPassword , listUsers , userById , WhoAmI , getDashbardData } = require("../controller/userControllerDashboard");
// const { register, login, generateOtpForPasswordReset, resetPassword } = require("../controller/user");
const checkSuperAdmin = require('../middleware/superAdmin')
const { resetPasswordUser, registerValidator, loginValidator } = require('../validator/user');

router.post("/create-user", authenticate, async (req, res, next) => {
    console.log("shashank", req.body)
    const role = req.body.role || (req.body.fields && req.body.fields.role);

    console.log("Role === >", role);
    // Define the allowed fields based on the user's role
    let allowedFields;
    if (role === "seller") {
        allowedFields = [
            { name: 'adhaar', maxCount: 1 },
            { name: 'companyPan', maxCount: 1 },
            { name: 'blankCheque', maxCount: 1 },
            { name: 'certificate_of_incorporate', maxCount: 1 },
            { name: 'profile', maxCount: 1 },
        ];
    } else if (role === "buyer") {
        allowedFields = [
            { name: 'adhaar', maxCount: 1 },
            { name: 'individualPan', maxCount: 1 },
            { name: 'blankCheque', maxCount: 1 },
            { name: 'source_of_fund', maxCount: 1 },
            { name: 'profile', maxCount: 1 },
        ];
    } 

    // Add the allowed fields to the request object for use in the register function
    req.allowedFields = allowedFields;

    // Call the next middleware in the chain
    next();
}, upload?.fields((req) => req.allowedFields), register);

// router.post("/login", validate(loginValidator), login);
router.post("/login", login);

router.post("/generate-otp", generateOtpForPasswordReset);
router.post("/reset-password", validate(resetPasswordUser), resetPassword);

router.get("/list-users", authenticate, checkSuperAdmin, listUsers)
router.get("/", authenticate, checkSuperAdmin, userById)
router.get("/who-am-i", authenticate, WhoAmI)
router.get("/dashboard", authenticate, getDashbardData)
router.patch("/:id",  authenticate ,   checkSuperAdmin , userById)



module.exports = router