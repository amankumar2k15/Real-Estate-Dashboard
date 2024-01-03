const mongoose = require("mongoose")


const flatSchema = new mongoose.Schema({
    flat_name: { type: String, default: null },
    flat_image: { type: String, default: null },
    flat_type: { type: String, default: null }
});

const buildingSchema = new mongoose.Schema({
    block: { type: String, default: null },
    flats: [flatSchema]
});

const siteSchema = new mongoose.Schema({
    site_name: { type: String, default: null },
    site_image: { type: String, default: null },
    site_location: { type: String, default: null },
    site_description: { type: String, default: null },
    buildings: [buildingSchema]
}, { timestamps: true });



siteSchema.index({ site_name: 'text' });

module.exports = SiteModel = mongoose.model("SiteModel", siteSchema)


