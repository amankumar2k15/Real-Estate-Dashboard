const mongoose = require("mongoose")

const flatSchema = new mongoose.Schema({
    buildingId: { type: String, default: null },
    sellerId: { type: String, default: null },
    flat_name: { type: String, default: null },
    flat_image: { type: String, default: null },
    flat_type: { type: String, default: null }
}, { timestamps: true });



module.exports = flatModel = mongoose.model("flatModel", flatSchema)


