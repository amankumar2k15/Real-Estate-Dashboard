const mongoose = require("mongoose")



const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    role: {
    type: String,
    enum: ['seller', 'buyer', 'admin', "bank"], // Use an enumeration to restrict the values
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    sellerId : { type: String, default: null },
    buyerId : { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    adhaar: { type: String, default: null },
    companyPan: { type: String, default: null },
    individualPan: { type: String, default: null },
    blankCheque: { type: String, default: null },
    certificate_of_incorporate: { type: String, default: null },
    source_of_fund: { type: String, default: null },
    otp: { type: Number, default: null },
})

userSchema.index({ username: 'text' });

const userModel = mongoose.model("userModel", userSchema)

module.exports = userModel
