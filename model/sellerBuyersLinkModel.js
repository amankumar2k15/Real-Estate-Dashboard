const mongoose = require("mongoose")

const sellerBuyers = new mongoose.Schema({

    sellerID: { type: String, default: null },
    buyerID: { type: mongoose.Types.ObjectId, default: null }

}, { timestamps: true });



const sellerBuyersLinkModel = mongoose.model("sellerBuyersLinkModel", sellerBuyers)
module.exports  = sellerBuyersLinkModel

