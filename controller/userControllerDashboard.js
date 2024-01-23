const { error, success } = require("../helper/baseResponse")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sellerModel = require("../model/sellorModel")
const buyerModel = require("../model/buyerModel")
const sendMail = require("../helper/sendMail")
const generateOtp = require("../helper/generateOtp")
const siteModel = require("../model/siteModel")
require('dotenv').config();


// useful

const login = async (req, res) => {
    try {
        var dbPassword,user
        if (req.body.email === "admin@gmail.com" && req.body.password === "Admin@123") {
            const payload = {
                username: null,
                role: "super-admin",
                id: null
            };
            const options = {
                expiresIn: '1d', // Token will expire in one day
            };
            const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
            const result = {
                username: "SUPER ADMIN",
                role: "super-admin",
                token: jwt_token,
            };

            return res.status(200).json(success("Logged in successfully", result, 200));
        }

        const [sellerResult, buyerResult] = await Promise.all([
            sellerModel.findOne({ email: req.body.email }),
            buyerModel.findOne({ email: req.body.email })
        ]);

        if (!!sellerResult) { console.log("Seller Result:", sellerResult); dbPassword = sellerResult?.password; user = sellerResult }
        else if (!!buyerResult) { console.log("Buyer Result:", buyerResult); dbPassword = buyerResult?.password; user = buyerResult }
        if (dbPassword) {
            const isPasswordCorrect = await bcrypt.compare(req.body.password, dbPassword);
            if (!isPasswordCorrect)
                return res.status(400).json(error("Wrong Password Entered", 400));
        } else {
            return res.status(500).json(error("You are not registered", 500));
        }
        const payload = {
            username: user.fullName,
            role: user.role,
            id: user._id
        };
        const options = {
            expiresIn: 60*1, // Token will expire in one day
        };

        const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);

        const result = {
            username: user.fullName,
            role: user.role,
            token: jwt_token,
        };

        return res.status(200).json(success("Logged in successfully", result, 200));
    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};



// un used 

const generateOtpForPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(422).json(error("Email is missing", 422));
        const otp = generateOtp(6);

        const [sellerResult, buyerResult] = await Promise.all([
            sellerModel.findOne({ email }),
            buyerModel.findOne({ email })
        ]);
        if (!!sellerResult) {
            await sendMail(email, "Bharat Escrow Forgot Password OTP", "OTP is " + otp);
            await sellerModel.findOneAndUpdate({ email }, { otp: otp }, { new: true });
            return res.status(200).json(
                success("OTP Sent", sellerResult, 200)
            )
        }
        else if (!!buyerResult) {
            await sendMail(email, "Bharat Escrow Forgot Password OTP", "OTP is " + otp);
            await buyerModel.findOneAndUpdate({ email }, { otp: otp }, { new: true });
            return res.status(200).json(
                success("OTP Sent", buyerResult, 200)
            )
        } else {
            return res.status(500).json(
                error("Email not found ", 500)
            )
        }
    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword, otp, email } = req.body;
        const [sellerResult, buyerResult] = await Promise.all([
            sellerModel.findOne({ email }),
            buyerModel.findOne({ email })
        ]);
        if (!!sellerResult) {
            if (sellerResult?.otp != otp) {
                return res.status(400).json(error("Invalid OTP entered", 400));
            }
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(newPassword, salt);
            await sellerModel.findOneAndUpdate({ email }, { password: securedPassword }, { new: true });
            return res
                .status(200)
                .json(success("Updated", "Seller password updated", 200));
        }
        else if (!!buyerResult) {
            if (buyerResult?.otp != otp) {
                return res.status(400).json(error("Invalid OTP entered", 400));
            }
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(newPassword, salt);
            await buyerModel.findOneAndUpdate({ email }, { password: securedPassword }, { new: true });
            return res
                .status(200)
                .json(success("Updated", "Buyer password updated", 200));
        }

    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};



const register = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}



const userKYCRegistration = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}

const listUsers = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}

const userById = async (req, res) => {
    try {
        // const { isApproved, id, search } = req.query;
        // if (search) {
        //     const users = await UserModelDashboard.find({ username: { $regex: search, $options: 'i' } }, { username: 1 });
        //     return res.status(201).json(
        //         success("Search result", users, 201)
        //     )
        // } else if (!isApproved) {
        //     const user = await UserModelDashboard.findById(id)
        //     return res.status(201).json(
        //         success("User fetched Successfully", user, 201)
        //     )
        // }

    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}

const WhoAmI = async (req, res) => {
    try {
        const [sellerResult, buyerResult] = await Promise.all([
            sellerModel.findById(req.user.id),
            buyerModel.findById(req.user.id)
        ]);

        if (!!sellerResult) {

            return res.status(200).json(
                success("Seller details fetched successfully", sellerResult, 200)
            )
        }
        else if (!!buyerResult) {
            return res.status(200).json(
                success("Buyer details fetched successfully", buyerResult, 200)
            )
        } else {
            const body = { fullName: "Super-Admin", role: "super-admin" }
            return res.status(200).json(
                success("Super Admin details fetched successfully", body, 200)
            )
        }
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}

const getDashbardData = async (req, res) => {
    try {
        try {
            console.log(req.user.role, "req.body.role");
            const [sellerResult, buyerResult] = await Promise.all([
                sellerModel.findById(req.user.id),
                buyerModel.findById(req.user.id)
            ]);
            if (req.user.role === "seller" && !!sellerResult) {
                const buyerInsideSeller = await buyerModel.find({ sellerId: req.user.id })
                const siteInsideSeller = await siteModel.find({ sellerId: req.user.id })
                console.log(siteInsideSeller);
                const data = {
                    buyerCount: buyerInsideSeller?.length,
                    siteCount: siteInsideSeller?.length
                }
                return res.status(200).json(
                    success("Seller dashboard fetched successfully", data, 200)
                )
            }
            else if (req.user.role === "buyer" && !!buyerResult) {
                // const buyerInsideSeller = await buyerModel.find({sellerId : req.user.id})
                // const siteInsideSeller = await siteModel.find({sellerId : req.user.id})
                // const data ={
                //     buyerCount :buyerInsideSeller?.length,
                //     siteCount : siteInsideSeller?.length
                // }
                return res.status(200).json(
                    success("Buyer dashboard fetched successfully", buyerResult, 200)
                )
            } else {
                const buyer = await buyerModel.find()
                const seller = await sellerModel.find()
                const site = await siteModel.find()
                const data = {
                    buyerCount: buyer?.length,
                    sellerCount: seller?.length,
                    siteCount: site?.length
                }
                return res.status(200).json(
                    success("Super Admin dashboard fetched successfully", data, 200)
                )
            }
        } catch (err) {
            return res.status(500).json(error(err.message, 500))
        }

    }
    catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}



module.exports = {
    register,
    listUsers,
    userById,
    userKYCRegistration,
    WhoAmI,
    login,
    generateOtpForPasswordReset,
    resetPassword,
    getDashbardData
};