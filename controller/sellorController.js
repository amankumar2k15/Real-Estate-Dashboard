const sellerModel = require("../model/sellorModel");
const UserModelDashboard = require("../model/userModelDashboard");
const { uploadImg } = require("../utils/cloudinary");
const { validationResult } = require("express-validator");

const sellerRegistration = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Validate file arrays
        const requiredFiles = ["adhaar", "companyPan", "blankCheque", "certificate_of_incorporate"];
        for (const file of requiredFiles) {
            if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
                return res.status(400).json({ success: false, message: `Please upload ${file} file` });
            }
        }

        const newUser = new sellerModel(req.body);

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
        newUser.companyPan = uploadResults.companyPan;
        newUser.blankCheque = uploadResults.blankCheque;
        newUser.certificate_of_incorporate = uploadResults.certificate_of_incorporate;

        await newUser.save();

        const message = "Your account is registered successfully, and Bharat Escrow will let you know when your account is approved.";
        // await sendEmail({ username: newUser.fullName, email: newUser.email, phone: newUser.phone, subject: "Sellor request registered successfully", message: message });

        res.status(200).json({ success: true, message, result: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const listSeller = async (req, res) => {
    try {
        const users = await UserModelDashboard.find()
        const listAll = await sellerModel.find();
        // console.log(users , "usersusersusersusersusersrs");
        const final = { profile: users.profile, ...listAll[0] }
        console.log(final, "final");
        console.log(final, "listing ");

        if (listAll.length === 0) return res.status(204).json({ success: false, message: "No Record", result: [] });
        return res.status(200).json({ success: true, message: "fetched successfully", result: listAll });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = {
    sellerRegistration,
    listSeller
};
