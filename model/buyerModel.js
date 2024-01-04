const mongoose = require("mongoose")

const buyerSchema = mongoose.Schema({
    siteId: { type: String, default: null },
    sellerId: { type: String, default: null },
    fullName: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
    profile: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    role: {
        type: String,
        default: "buyer",
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    adhaar: { type: String, default: null },
    pan: { type: String, default: null },
    blankCheque: { type: String, default: null },
    source_of_fund: { type: String, default: null },
})

buyerSchema.index({ fullName: 'text' , username : "text" });

const buyerModel = mongoose.model("buyerModel", buyerSchema)

module.exports = buyerModel
