const { body, param } = require("express-validator");







const resetPasswordUser = [
    body("otp").notEmpty().withMessage("Please enter otp"),
    body("newPassword")
        .notEmpty()
        .withMessage("Please enter new password")
        .isString()
        .withMessage("Please enter a valid new password")
];

module.exports = {
    resetPasswordUser,
};
