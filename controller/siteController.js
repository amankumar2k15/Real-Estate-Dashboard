const SiteModel = require("../model/siteModel");
const { uploadImg } = require("../utils/cloudinary");





const siteRegister = async (req, res) => {


  try {
    const { site_name, site_location, site_description } = req.body;
    // Validate file arrays
    console.log("aman req files ", req.file)

    if (!req.file) {
      return res.status(400).json({ success: false, message: `Please upload site_image file` });
    }

    const uploadResult = await uploadImg(req.file.path, req.file.originalname);
    if (!uploadResult.success) {
      return res.status(500).json({ success: false, message: "Error uploading Site image" });
    }
    const newSite = new SiteModel({
      sellerId: req.user.id,
      site_name,
      site_image: uploadResult.url,
      site_location,
      site_description,
    });

    await newSite.save();
    res.status(201).json({ message: 'Site created successfully', data: newSite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const listSite = async (req, res) => {
  try {
    const listAll = await SiteModel.find();
    if (listAll.length === 0) return res.status(204).json({ success: false, message: "No Record", result: [] });
    return res.status(200).json({ success: true, message: "Site fetched successfully", result: listAll });

  } catch (err) {
    // console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};





module.exports = {
  siteRegister,
  listSite
}