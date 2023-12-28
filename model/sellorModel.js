const mongoose = require("mongoose")

const sellerSchema = mongoose.Schema({
    companyName: { type: String, default: null },
    fullName: { type: String, default: null },
    userId: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    role: {
        type: String,
        default: "admin",
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    adhaar: { type: String, default: null },
    companyPan: { type: String, default: null },
    blankCheque: { type: String, default: null },
    certificate_of_incorporate: { type: String, default: null }
})

sellerSchema.index({ fullName: 'text' });

const sellerModel = mongoose.model("sellerModel", sellerSchema)

module.exports = sellerModel
