const { error, success } = require("../helper/baseResponse")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// unUsed======>
const sellerModel = require("../model/sellorModel")
const buyerModel = require("../model/buyerModel")
const siteModel = require("../model/siteModel")
const newModel = require("../model/newModel")
// unUsed======>

const sendMail = require("../helper/sendMail")
const generateOtp = require("../helper/generateOtp")
const adminSellersLinkModel = require("../model/adminSellersLinkModel")
const sellerBuyersLinkModel = require("../model/sellerBuyersLinkModel")
const generatePassword = require("../helper/generatePassword")
const { validationResult } = require("express-validator")
const { uploadImg } = require("../utils/cloudinary")
const adminTrusteeLinkModel = require("../model/adminTrusteeLinkModel")
require('dotenv').config();


const register = async (req, res) => {
    try {
        const { username, role, email } = req.body;

        // Validate role
        if (!role || !['admin', 'seller', 'buyer', 'trustee'].includes(role)) {
            return res.status(403).json({ message: 'Role is required and must be one of: admin, seller, buyer, trustee' });
        }

        // Generate secure password
        const salt = await bcrypt.genSalt(10);
        const password = generatePassword(username);
        console.log("Generated Password:", password);
        const securedPassword = await bcrypt.hash(password, salt);

        let newRecord;

        switch (role) {
            case "seller":
                // Seller registration logic
                if (req.user.role !== "admin") return res.status(403).json({ message: 'Only admins can create sellers.' });
                newRecord = await registerSeller(req, securedPassword);
                break;

            case "buyer":
                // Buyer registration logic
                if (req.user.role !== "seller") return res.status(403).json({ message: 'Only sellers can create buyers.' });
                newRecord = await registerBuyer(req, securedPassword);
                break;

            case "trustee":
                // Trustee registration logic
                if (req.user.role !== "admin") return res.status(403).json({ message: 'Only admins can create trustees.' });
                newRecord = await registerTrustee(req, securedPassword);
                break;

            case "admin":
                // Admin registration logic
                newRecord = await registerAdmin(req, securedPassword);
                break;

            default:
                return res.status(422).json({ message: `Invalid role: ${role}. Role must be one of: admin, seller, buyer, trustee` });
        }

        // Send email with credentials
        await sendMail(email, `Welcome ${role.charAt(0).toUpperCase() + role.slice(1)}`, `Here are your credentials:\nEmail: ${email}\nPassword: ${password}`);

        return res.status(201).json({ message: `${role} created successfully`, data: newRecord });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Seller registration function
const registerSeller = async (req, securedPassword) => {
    const { username, email } = req.body;
    // Validate required files for seller registration
    const requiredFiles = ["adhaar", "companyPan", "blankCheque", "certificate_of_incorporate", "profile"];
    for (const file of requiredFiles) {
        if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
            throw new Error(`Please upload ${file} file`);
        }
    }
    // Upload files
    const uploadResults = await uploadFiles(req.files);
    // Create new seller record
    const newSeller = await createNewModelRecord(username, securedPassword, email, 'seller', uploadResults);
    // Update admin's associated_sellers
    await updateAdminAssociatedSellers(req.user.id, newSeller._id);
    return newSeller;
};

// Buyer registration function
const registerBuyer = async (req, securedPassword) => {
    const { username, email } = req.body;
    // Validate required files for buyer registration
    const requiredFiles = ["adhaar", "individualPan", "blankCheque", "source_of_fund", "profile"];
    for (const file of requiredFiles) {
        if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
            throw new Error(`Please upload ${file} file`);
        }
    }
    // Upload files
    const uploadResults = await uploadFiles(req.files);
    // Create new buyer record
    const newBuyer = await createNewModelRecord(username, securedPassword, email, 'buyer', uploadResults);
    // Update seller's associated_buyers
    await updateSellerAssociatedBuyers(req.user.id, newBuyer._id);
    return newBuyer;
};

// Trustee registration function
const registerTrustee = async (req, securedPassword) => {
    const { username, email } = req.body;
    // Validate required files for trustee registration
    const requiredFiles = ["individualPan", "profile"];
    for (const file of requiredFiles) {
        if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
            throw new Error(`Please upload ${file} file`);
        }
    }
    // Upload files
    const uploadResults = await uploadFiles(req.files);
    // Create new trustee record
    const newTrustee = await createNewModelRecord(username, securedPassword, email, 'trustee', uploadResults);
    // Update admin's associated_trustees
    await updateAdminAssociatedTrustees(req.user.id, newTrustee._id);
    return newTrustee;
};

// Admin registration function
const registerAdmin = async (req, securedPassword) => {
    const { username, email } = req.body;
    // Validate required files for admin registration
    const requiredFiles = ["profile"];
    for (const file of requiredFiles) {
        if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
            throw new Error(`Please upload ${file} file`);
        }
    }
    // Upload files
    const uploadResults = await uploadFiles(req.files);
    // Create new admin record
    const newAdmin = await createNewModelRecord(username, securedPassword, email, 'admin', uploadResults);
    return newAdmin;
};

// Helper function to upload files
const uploadFiles = async (files) => {
    const uploadResults = {};
    for (const file in files) {
        const uploadResult = await uploadImg(files[file][0].path, files[file][0].originalname);
        if (!uploadResult.success) {
            throw new Error("Error uploading image");
        }
        uploadResults[file] = uploadResult.url;
    }
    return uploadResults;
};

// Helper function to create new record in newModel
const createNewModelRecord = async (username, securedPassword, email, role, uploadResults) => {
    const newRecord = new newModel({
        username,
        password: securedPassword,
        email,
        role,
        otp: null,
        ...getRoleSpecificFields(role, uploadResults)
    });
    await newRecord.save();
    return newRecord;
};

// Helper function to get role-specific fields
const getRoleSpecificFields = (role, uploadResults) => {
    switch (role) {
        case 'seller':
            return {
                seller: {
                    basic_details: {
                        profile: uploadResults.profile,
                        // Add other fields here
                    },
                    kyc_details: {
                        // Add KYC details here
                    },
                    isApproved: true,
                    associated_buyers: [],
                    associated_sites: []
                }
            };
        case 'buyer':
            return {
                buyer: {
                    basic_details: {
                        profile: uploadResults.profile,
                        // Add other fields here
                    },
                    kyc_details: {
                        // Add KYC details here
                    },
                    isApproved: true,
                    purchased_site: [],
                    assigned: true
                }
            };
        case 'trustee':
            return {
                trustee: {
                    basic_details: {
                        profile: uploadResults.profile,
                        // Add other fields here
                    },
                    kyc_details: {
                        // Add KYC details here
                    },
                    isApproved: true
                }
            };
        case 'admin':
            return {
                admin: {
                    basic_details: {
                        profile: uploadResults.profile,
                        // Add other fields here
                    },
                    associated_sellers: [],
                    associated_trustees: [],
                    unassigned_buyers: []
                }
            };
        default:
            return {};
    }
};

// Helper function to update admin's associated_sellers
const updateAdminAssociatedSellers = async (adminId, sellerId) => {
    await newModel.findByIdAndUpdate(adminId, { $push: { 'admin.associated_sellers': { sellerId } } });
};

// Helper function to update seller's associated_buyers
const updateSellerAssociatedBuyers = async (sellerId, buyerId) => {
    await newModel.findByIdAndUpdate(sellerId, { $push: { 'seller.associated_buyers': { buyerId } } });
};

// Helper function to update admin's associated_trustees
const updateAdminAssociatedTrustees = async (adminId, trusteeId) => {
    await newModel.findByIdAndUpdate(adminId, { $push: { 'admin.associated_trustees': { trusteeId } } });
};
























































const login = async (req, res) => {
    try {
        try {
            const { username, password } = req.body;
            const user = await newModel.findOne({ username })
            console.log(user, "user -==============> ");
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect)
                return res.status(400).json(error("Wrong Password Entered", 400));

            const payload = {
                username: user.username,
                role: user.role,
                id: user._id,
                email: user.email
            };
            const jwt_token = await jwt.sign(payload, process.env.JWT_KEY);

            let body = {
                username: user.username,
                role: user.role,
                token: jwt_token,
            };
            return res.status(200).json(success("Logged in successfully", body, 200));
        } catch (err) {
            return res.status(500).json(error(err.message), 500);
        }

    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};



// un used 

const generateOtpForPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("generateOtpForPasswordReset Email", req.body)
        if (!email) return res.status(422).json(error("Email is missing", 422));
        const otp = generateOtp(6);

        const findUser = await newModel.findOne({ email })
        if (!findUser) {
            return res.status(422).json(error("Email does not exist", 422))
        }

        await sendMail(email, "Bharat Escrow Forgot Password OTP", "OTP is " + otp);
        findUser.otp = otp;
        await findUser.save()
        // await newModel.findOneAndUpdate({ email }, { otp: otp }, { new: true });

        return res.status(200).json(success("OTP Sent", 200))

    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword, otp, email } = req.body;

        const findUser = await newModel.findOne({ email })
        if (!findUser) return res.status(422).json(error("Email does not exist", 422))
        else if (findUser.otp != otp) return res.status(400).json(error("Invalid OTP entered", 400));

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);
        await newModel.findOneAndUpdate({ email }, { password: securedPassword }, { new: true });
        return res.status(200).json(success("Updated", "User password updated", 200));

    } catch (err) {
        return res.status(500).json(error(err.message, 500));
    }
};

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
        //     const users = await newModel.find({ username: { $regex: search, $options: 'i' } }, { username: 1 });
        //     return res.status(201).json(
        //         success("Search result", users, 201)
        //     )
        // } else if (!isApproved) {
        //     const user = await newModel.findById(id)
        //     return res.status(201).json(
        //         success("User fetched Successfully", user, 201)
        //     )
        // }

    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}


const getUserDetails = async (req, res) => {
    try {
        const { username } = req.params;

        // Perform aggregation based on user's role
        const userDetails = await newModel.aggregate([
            { $match: { username } }, // Match the user by username
            {
                $project: {
                    username: 1,
                    password: 1,
                    email: 1,
                    role: 1,
                    admin: {
                        $cond: {
                            if: { $eq: ["$role", "admin"] },
                            then: {
                                basic_details: {
                                    profile: "$admin.basic_details.profile",
                                    firstName: "$admin.basic_details.firstName",
                                    lastName: "$admin.basic_details.lastName",
                                    phone: "$admin.basic_details.phone",
                                    address: "$admin.basic_details.address",
                                    location: "$admin.basic_details.location",
                                    state: "$admin.basic_details.state",
                                    city: "$admin.basic_details.city",
                                    pincode: "$admin.basic_details.pincode"
                                },
                                associated_sellers: "$admin.associated_sellers",
                                associated_trustee: "$admin.associated_trustee",
                                unassigned_buyers: "$admin.unassigned_buyers"
                            },
                            else: null
                        }
                    }
                }
            }
        ]);

        if (!userDetails || userDetails.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User details retrieved successfully", userDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const WhoAmI = async (req, res) => {
    console.log("reaching in WHO AM I StartPoint for role==> ", req.user.role)
    console.log("reaching in WHO AM I StartPoint for id==> ", req.user.id)
    try {
        if (req.user.role === "admin") {
            console.log("reaching in WHO AM I inside if", req.user.username)

            const { username } = req.user;
            // Perform aggregation based on user's role
            console.log("reaching in WHO AM I inside if", req.user.username)
            const adminData = await newModel.find({
                $and: [
                    { role: 'admin' },
                    { username: username } // Replace 'username' with the specific username value you're searching for
                ]
            }).populate({
                path: 'admin.associated_sellers',
                populate: { path: 'sellerId', select: '_id username email seller' } // Specify the fields you want to retrieve for the seller
            }) // Select only the admin field to retrieve

            if (!adminData || adminData.length === 0) {
                return res.status(404).json({ success: false, message: 'Admin data not found.' });
            }
            console.log(adminData, "adminData");
            // Extract only the seller details from the populated associated_sellers array if it exists
            let sellers = [];
            if (adminData[0].admin && adminData[0].admin.associated_sellers) {
                sellers = adminData[0].admin.associated_sellers.map(seller => {
                    const numBuyers = seller?.sellerId?.seller?.associated_buyers?.length ? seller?.sellerId?.seller?.associated_buyers?.length : 0;
                    console.log(seller, "seller individual" , numBuyers);
                    return {
                        username: seller?.sellerId?.username,
                        _id: seller?.sellerId?._id,
                        email: seller?.sellerId?.email,
                        phone: seller?.sellerId?.seller?.basic_details?.phone ? seller?.sellerId?.seller?.basic_details?.phone : "N/A",
                        companyName: seller?.sellerId?.seller?.basic_details?.companyName ? seller?.sellerId?.seller?.basic_details.companyName : "N/A",
                        profile: seller?.sellerId?.seller?.basic_details?.profile,
                        location: seller?.sellerId?.seller?.basic_details?.location ? seller?.sellerId?.seller?.basic_details?.location : "N/A",
                        state: seller?.sellerId?.seller?.basic_details?.state ? seller?.sellerId?.seller?.basic_details?.state : "N/A",
                        city: seller?.sellerId?.seller?.basic_details?.city ? seller?.sellerId?.seller?.basic_details?.city : "N/A",
                        approved: seller?.sellerId?.seller?.isApproved,
                        numBuyers :numBuyers
                    };
                });
            }


            // Construct the response with the desired admin fields and the populated sellers
            const responseData = {
                username: adminData[0].username,
                email: adminData[0].email,
                phone: adminData[0].admin.basic_details.phone ? adminData[0].admin.basic_details.phone : "N/A",
                profile: adminData[0].admin.basic_details.profile ? adminData[0].admin.basic_details.profile : "N/A",
                // Add other admin fields as needed
                associated_sellers: sellers
            };

            // Extract only the seller details from the populated associated_sellers array
            // const sellers = adminData.admin.associated_sellers.map(seller => seller.sellerId);
            res.status(200).json({ success: true, result: responseData });
        }
        
        // seller logi starts here ============================================================================----------------------------------------------===>
        
        else if (req.user.role === "seller") {
            const { username } = req.user;
            // Perform aggregation based on user's role and username
            console.log("reaching in WHO AM I inside if", req.user.username)
            const sellerData = await newModel.find({
                $and: [
                    { role: 'seller' },
                    { username: username } // Replace 'username' with the specific username value you're searching for
                ]
            }).populate({
                path: 'seller.associated_buyers',
                populate: { path: 'buyerId', select: '_id username email buyer' } // Specify the fields you want to retrieve for the buyer
            }) // Select only the seller field to retrieve

            if (!sellerData || sellerData.length === 0) {
                return res.status(404).json({ success: false, message: 'Seller data not found.' });
            }

            console.log(sellerData, "sellerData");
            // Extract only the seller details from the populated associated_sellers array if it exists
            let buyers = [];
            if (sellerData[0].seller && sellerData[0].seller.associated_buyers) {
                buyers = sellerData[0].seller.associated_buyers.map(buyer => {
                    console.log(buyer, "buyer individual");
                    return {
                        username: buyer.buyerId.username,
                        _id: buyer.buyerId._id,
                        email: buyer.buyerId.email,
                        phone: buyer.buyerId.buyer.basic_details.phone ? buyer.buyerId.buyer.basic_details.phone : "N/A",
                        companyName: buyer.buyerId.buyer.basic_details.companyName ? buyer.buyerId.buyer.basic_details.companyName : "N/A",
                        profile: buyer.buyerId.buyer.basic_details.profile,
                        location: buyer.buyerId.buyer.basic_details.location ? buyer.buyerId.buyer.basic_details.location : "N/A",
                        state: buyer.buyerId.buyer.basic_details.state ? buyer.buyerId.buyer.basic_details.state : "N/A",
                        city: buyer.buyerId.buyer.basic_details.city ? buyer.buyerId.buyer.basic_details.city : "N/A",
                        approved: buyer.buyerId.buyer.isApproved,
                    };
                });
            }


            // Construct the response with the desired admin fields and the populated sellers
            const responseData = {
                username: sellerData[0].username,
                email: sellerData[0].email,
                phone: sellerData[0].admin.basic_details.phone ? sellerData[0].admin.basic_details.phone : "N/A",
                profile: sellerData[0].admin.basic_details.profile ? sellerData[0].admin.basic_details.profile : "N/A",
                // Add other admin fields as needed
                associated_buyers: buyers
            };

            // Extract only the seller details from the populated associated_sellers array
            // const sellers = adminData.admin.associated_sellers.map(seller => seller.sellerId);
            res.status(200).json({ success: true, result: responseData });
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
    getDashbardData,
    getUserDetails
};