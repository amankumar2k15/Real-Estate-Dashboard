const mongoose = require("mongoose")

const sellerBuyers = new mongoose.Schema({
   
    sellerID: { type: String, default: null },
    buyerID: { type: String, default: null }

}, { timestamps: true });



module.exports = sellerBuyersLinkModel = mongoose.model("sellerBuyersLinkModel", sellerBuyers)


