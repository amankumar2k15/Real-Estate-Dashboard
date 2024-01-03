const { body } = require("express-validator");
const siteModel = require("../model/siteModel");

const siteRegisterValidator = [
    body("site_name")
        .notEmpty().withMessage("Please enter site_name")
        .custom(async (value) => {
            const existingSiteName = await siteModel.findOne({ site_name: value });
            if (existingSiteName) {
                throw new Error("Site already exists!");
            }
        }),
    body("site_location")
        .notEmpty().withMessage("Please enter site_location ")
        .isString().withMessage("Please enter valid site_location"),
    body("site_description")
        .notEmpty().withMessage("Please enter site_description ")
        .isString().withMessage("Please enter valid site_description"),
];

module.exports = {
    siteRegisterValidator
};
