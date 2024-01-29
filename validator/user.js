const { body, param } = require("express-validator");
const userModel = require("../model/newModel");

const registerValidator = [
    body("username")
        .notEmpty().withMessage("Please enter Username")
        .isString().withMessage("Please enter a valid Username")
        .custom(async (value) => {
            const existingUser = await userModel.findOne({ username: value });
            if (existingUser) {
                // return res.status(500).json(error(err.message, 500))
                throw new Error("User with this username already exists!");
            }
        }),
    body("email")
        .notEmpty().withMessage("Please enter email")
        .isEmail().withMessage("Please enter a valid email")
        .custom(async (value) => {
            const existingUser = await userModel.findOne({ email: value });
            if (existingUser) {
                throw new Error("User with this email already exists!");
            }
        }),

    body("role")
        .notEmpty()
        .withMessage("Please enter role")
        .isString()
        .withMessage("Please enter a valid role")
];


const loginValidator = [
    body("username")
        .notEmpty().withMessage("Please enter Username")
        .isString().withMessage("Please enter a valid username")
        .custom(async (value) => {
            const existingUser = await userModel.findOne({ username: value });
            if (!existingUser) {
                throw new Error("User with this username does't exist !!");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("Please enter password")
        .isString()
        .withMessage("Please enter a valid  password")

];





const resetPasswordUser = [
    body("otp").notEmpty().withMessage("Please enter otp"),
    body("newPassword")
        .notEmpty()
        .withMessage("Please enter new password")
        .isString()
        .withMessage("Please enter a valid new password")
];

module.exports = {
    registerValidator,
    loginValidator,
    resetPasswordUser,
};
