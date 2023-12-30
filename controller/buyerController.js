const buyerModel = require("../model/buyerModel");
const { uploadImg } = require("../utils/cloudinary");
const { validationResult } = require("express-validator");

const buyerRegistration = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Validate file arrays
        const requiredFiles = ["adhaar", "pan", "blankCheque", "source_of_fund"];
        for (const file of requiredFiles) {
            if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
                return res.status(400).json({ success: false, message: `Please upload ${file} file` });
            }
        }

        const newUser = new buyerModel(req.body);

        // Upload files
        const uploadResults = {};
        for (const file of requiredFiles) {
            const uploadResult = await uploadImg(req.files[file][0].path, req.files[file][0].originalname);
            if (!uploadResult.success) {
                return res.status(500).json({ success: false, message: "Error uploading image" });
            }
            uploadResults[file] = uploadResult.url;
        }
        // Update user properties with Cloudinary URLs
        newUser.adhaar = uploadResults.adhaar;
        newUser.pan = uploadResults.pan;
        newUser.blankCheque = uploadResults.blankCheque;
        newUser.source_of_fund = uploadResults.source_of_fund;

        await newUser.save();
        const message = "buyer registered";
        // await sendEmail({ username: newUser.fullName, email: newUser.email, phone: newUser.phone, subject: "Sellor request registered successfully", message: message });
        res.status(200).json({ success: true, message, result: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports ={
    buyerRegistration
}
