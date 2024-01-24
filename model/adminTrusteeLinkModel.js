const mongoose = require("mongoose")

const adminTrustee = new mongoose.Schema({

    adminID: { type: String, required: true },
    trusteeID: { type: mongoose.Types.ObjectId, required: true }

}, { timestamps: true });


module.exports = adminTrusteeLinkModel = mongoose.model("adminTrusteeLinkModel", adminTrustee)


