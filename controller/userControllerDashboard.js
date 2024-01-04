const { error, success } = require("../helper/baseResponse")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sellerModel = require("../model/sellorModel")
const buyerModel = require("../model/buyerModel")
require('dotenv').config();


// useful

const login = async (req, res) => {
    console.log("aman", req.body)
    try {
        var dbPassword, user
        // Use Promise.all to execute queries concurrently

        // adding suoer admin layer


        if (req.body.email === "admin@gmail.com" && req.body.password === "Admin@123") {
            console.log("email", req.body.email)
            console.log("pass", req.body.password)
            const payload = {
                username: null,
                role: "super-admin",
                id: null
            };
            const options = {
                expiresIn: '1d', // Token will expire in one day
            };

            console.log(process.env.JWT_KEY)
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
            expiresIn: '1d', // Token will expire in one day
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
                success("Seller details fetched successfully", sellerResult , 200)
            )
        }
        else if (!!buyerResult) {
            return res.status(200).json(
                success("Buyer details fetched successfully", buyerResult , 200)
            )
        }else{
            return res.status(200).json(
                success("Super Admin details fetched successfully", {username : "Super-Admin" , role : "super-admin"} , 200)
            ) 
        }
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}



module.exports = {
    register,
    listUsers,
    userById,
    userKYCRegistration,
    WhoAmI,
    login
};