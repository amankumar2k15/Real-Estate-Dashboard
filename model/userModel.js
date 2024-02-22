const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
})

userSchema.index({ username: 'text' });

const userModel = mongoose.model("userModel", userSchema)

module.exports = userModel
