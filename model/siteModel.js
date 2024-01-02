const mongoose = require("mongoose")

const siteSchema = mongoose.Schema({
    site_name: { type: String, default: null },
    site_location: { type: String, default: null },
    buildings: [
        {
            block: { type: String, default: null },
            flats: [
                {
                    flat_name: { type: String, default: null },
                    flat_type: { type: String, default: null }
                }
            ]
        },

    ],

}, { timestamps: true })

siteSchema.index({ site_name: 'text' });

module.exports = SiteModel = mongoose.model("SiteModel", siteSchema)


