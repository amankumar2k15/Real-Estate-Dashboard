const mongoose = require("mongoose")

const adminSellers = new mongoose.Schema({
   
    adminID: { type: String,required : true   },
    sellerID: { type: String, required : true }

}, { timestamps: true });



module.exports = adminSellerLinkModel = mongoose.model("adminSellerLinkModel", adminSellers)


