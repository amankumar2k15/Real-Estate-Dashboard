const mongoose = require("mongoose")


const buildingSchema = new mongoose.Schema({
    block: { type: String, default: null },
    siteId: { type: String, default: null },
    sellerId: { type: String, default: null },
}, { timestamps: true });







module.exports = buildingModel = mongoose.model("buildingModel", buildingSchema)


