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
            profile: { type: String, },
            firstName: { type: String, },
            lastName: { type: String, },
            phone: { type: Number, },
            address: { type: String, },
            location: { type: String, },
            state: { type: String, },
            city: { type: String, },
            pincode: { type: String, },
        },
        kyc_details: {
            companyName: { type: String },
            certificate_of_incorporate: { type: String },
            blankCheque: { type: String },
            adhaar: { type: String },
            companyPan: { type: String },
        },
        isApproved: { type: Boolean },
        associated_buyers:{ type: Array },
        associated_sites:{ type: Array }
    },
    buyer: {
        basic_details: {
            profile: { type: String, },
            firstName: { type: String, },
            lastName: { type: String, },
            phone: { type: Number, },
            address: { type: String, },
            location: { type: String, },
            state: { type: String, },
            city: { type: String, },
            pincode: { type: String, },
        },
        kyc_details: {
            blankCheque: { type: String },
            individualPan: { type: String },
            source_of_fund: { type: String },
            adhaar: { type: String },
        },
        isApproved: { type: Boolean },
        purchased_site:{ type: Array }
    },
    trustee: {
        basic_details: {
            profile: { type: String, },
            firstName: { type: String, },
            lastName: { type: String, },
            phone: { type: Number, },
            address: { type: String, },
            location: { type: String, },

            state: { type: String, },
            city: { type: String, },
            pincode: { type: String, },
        },
        kyc_details: {
            individualPan: { type: String },
            bankName: { type: String },
        },
        isApproved: { type: Boolean },
    },
    admin: {
        basic_details: {
            profile: { type: String, },
            firstName: { type: String, },
            lastName: { type: String, },
            email: { type: String, },
            phone: { type: Number, },
            address: { type: String, },
            location: { type: String, },

            state: { type: String, },
            city: { type: String, },
            pincode: { type: String, },
        },
        associated_sellers: { type: Array },
        associated_trustee: { type: Array },
        unassigned_buyers: { type: Array },
    }
})

newSchema.index({ username: 'text' });

const newModel = mongoose.model("newModel", newSchema)

module.exports = newModel
