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
})

newSchema.index({ username: 'text' });

const newModel = mongoose.model("newModel", newSchema)

module.exports = newModel
