const mongoose = require("mongoose")




const siteSchema = new mongoose.Schema({
    sellerId: { type: String, default: null },
    site_name: { type: String, default: null },
    site_image: { type: String, default: null },
    site_location: { type: String, default: null },
    site_description: { type: String, default: null },
}, { timestamps: true });



siteSchema.index({ site_name: 'text' });

module.exports = SiteModel = mongoose.model("SiteModel", siteSchema)


