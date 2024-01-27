const mongoose = require("mongoose")

const newSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, default: null },
    role: {
        type: String,
        required: true,
        enum: ['seller', 'buyer', 'admin', "trustee"], // Use an enumeration to restrict the values
    },
    otp: { type: Number, default: null },
    seller: {
        basic_details: {
            profile: { type: String, default: null },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },
            phone: { type: Number, default: null },
            address: { type: String, default: null },
            location: { type: String, default: null },
            state: { type: String, default: null },
            city: { type: String, default: null },
            pincode: { type: String, default: null },
        },
        kyc_details: {
            companyName: { type: String },
            certificate_of_incorporate: { type: String },
            blankCheque: { type: String },
            adhaar: { type: String },
            companyPan: { type: String },
        },
        isApproved: { type: Boolean },
        associated_buyers: [],
        associated_sites: []
    },
    buyer: {
        basic_details: {
            profile: { type: String, default: null },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },
            phone: { type: Number, default: null },
            address: { type: String, default: null },
            location: { type: String, default: null },

            state: { type: String, default: null },
            city: { type: String, default: null },
            pincode: { type: String, default: null },
        },
        kyc_details: {
            blankCheque: { type: String },
            individualPan: { type: String },
            source_of_fund: { type: String },
            adhaar: { type: String },
        },
        isApproved: { type: Boolean },
        purchased_site: []
    },
    trustee: {
        basic_details: {
            profile: { type: String, default: null },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },
            phone: { type: Number, default: null },
            address: { type: String, default: null },
            location: { type: String, default: null },

            state: { type: String, default: null },
            city: { type: String, default: null },
            pincode: { type: String, default: null },
        },
        kyc_details: {
            individualPan: { type: String },
            bankName: { type: String },
        },
        isApproved: { type: Boolean },
    },
    admin: {
        basic_details: {
            profile: { type: String, default: null },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },
            email: { type: String, default: null },
            phone: { type: Number, default: null },
            address: { type: String, default: null },
            location: { type: String, default: null },

            state: { type: String, default: null },
            city: { type: String, default: null },
            pincode: { type: String, default: null },
        },
        associated_sellers: [],
        associated_trustee: [],
        unassigned_buyers: [],
    }
})

newSchema.index({ username: 'text' });

const newModel = mongoose.model("newModel", newSchema)

module.exports = newModel
