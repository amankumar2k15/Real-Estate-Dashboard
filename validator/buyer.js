const { body } = require("express-validator");
const sellerModel = require("../model/sellorModel");

const buyerRegister = [
    body("email")
        .notEmpty().withMessage("Please enter email")
        .isEmail().withMessage("Please enter a valid email")
        .custom(async (value) => {
            const existingUser = await sellerModel.findOne({ email: value });
            if (existingUser) {
                throw new Error("User with this email already exists!");
            }
        }),

    body("fullName")
        .notEmpty().withMessage("Please enter your name ")
        .isString().withMessage("Please enter a valid name"),

    body("phone")
        .notEmpty().withMessage("Please enter phone number ")
        .isNumeric().withMessage("Please enter a valid phone number ")
        .isLength({ min: 10, max: 10 }).withMessage('Please enter a 10-digit phone number ')
        .custom(async (value) => {
            const existingPhone = await sellerModel.findOne({ phone: value });
            if (existingPhone) {
                throw new Error("Phone number with this email already exists!");
            }
        }),

    body("address").notEmpty().withMessage("Please enter your address"),
    body("location").notEmpty().withMessage("Please enter your location"),
    body("state").notEmpty().withMessage("Please enter state"),
    body("city").notEmpty().withMessage("Please enter city"),
    body("pincode").notEmpty().withMessage("Please enter pincode"),
    // body("siteId").notEmpty().withMessage("Please enter site id"),
];

module.exports = {
    buyerRegister
};
