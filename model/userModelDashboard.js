const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: { type: String, default: null },
    googleId : { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    password: { type: String, default: null },
    profile: { type: String, default: null },
    role: { type: String, default: null },
})

userSchema.index({ username: 'text' });

const UserModelDashboard = mongoose.model("UserModelDashboard", userSchema)

module.exports = UserModelDashboard
