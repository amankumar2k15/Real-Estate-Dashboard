const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    password: { type: String, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    role: {
        enum: ["super-admin", "admin", "user"]
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    profile: { type: String, default: null },
    adhaar: { type: String, default: null },
    pan: { type: String, default: null },
    blankCheque: { type: String, default: null },
})

const UserModelDashboard = mongoose.model("UserModelDashboard", userSchema)

module.exports = UserModelDashboard
