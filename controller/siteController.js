const siteModel = require("../model/siteModel");
const SiteModel = require("../model/siteModel");
const UserModelDashboard = require("../model/userModelDashboard");
const { uploadImg } = require("../utils/cloudinary");
const cloudinary = require('cloudinary').v2;
const { validationResult } = require("express-validator");



const siteRegister = async (req, res) => {


    try {
        const { site_name, site_image, site_location, site_description, buildings } = req.body;
            // Validate file arrays
     
            if (!req.files["site_image"] ) {
                return res.status(400).json({ success: false, message: `Please upload site_image file` });
            }
        

        const uploadResult = await uploadImg(req.files["site_image"].path, req.files["site_image"].originalname);
        //         if (!uploadResult.success) {t
        //             return res.status(500).json({ success: false, message: "Error uploading image" });
        //         }
        
        // Validate that buildings is an array
        if (!Array.isArray(buildings)) {
          return res.status(400).json({ message: 'Buildings must be an array' });
        }
    
        // Validate each building in the array
        for (const building of buildings) {
          if (!building.block || !Array.isArray(building.flats)) {
            return res.status(400).json({ message: 'Each building must have a block and an array of flats' });
          }
          // Upload flat images to Cloudinary
          for (const flat of building.flats) {
            const imageBuffer = req.files.find(file => file.originalname === flat.flat_image).buffer;
            const cloudinaryResponse = await cloudinary.uploader.upload_stream(
              { resource_type: 'image' },
              async (error, result) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ message: 'Error uploading images to Cloudinary' });
                } else {
                  flat.flat_image = result.secure_url;
                }
              }
            ).end(imageBuffer);
          }
        }
    
        const newSite = new Site({
          site_name,
          site_image : uploadResult.url,
          site_location,
          site_description,
          buildings,
        });
    
        await newSite.save();
    
        res.status(201).json({ message: 'Site created successfully', data: newSite });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    








    // try {
    //     // Validate request body
    //     console.log(req.body, "req.body");
    //     const { site_name, site_location, site_description, block, flat_name, flat_type } = req.body
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ success: false, errors: errors.array() });
    //     }

    //     console.log("Image =====> ", req.files["site_image"]);

    //     // Validate file arrays
    //     const requiredFiles = ["site_image", "flat_image"];
    //     for (const file of requiredFiles) {
    //         if (!req.files[file] || !Array.isArray(req.files[file]) || req.files[file].length === 0) {
    //             return res.status(400).json({ success: false, message: `Please upload ${file} file` });
    //         }

    //     }

    //     const dataToSendInSiteModel = {
    //         site_name,

    //         site_location,
    //         site_description,
    //         buildings: [
    //             {
    //                 block,
    //                 flats: [
    //                     {
    //                         flat_name,
    //                         flat_image: [],
    //                         flat_type,
    //                     },
    //                 ],
    //             },
    //         ],
    //     }

    //     // Upload files
    //     const uploadResults = {};
    //     for (const file of requiredFiles) {
    //         const uploadResult = await uploadImg(req.files[file][0].pah, req.files[file][0].originalname);
    //         if (!uploadResult.success) {t
    //             return res.status(500).json({ success: false, message: "Error uploading image" });
    //         }
    //         // Update user properties with Cloudinary URLs
    //         console.log("reacheing here ====> ");
    //         uploadResults[file] = uploadResult.url;
    //     }

    //     console.log("over  here ====> ", uploadResults);


    //     dataToSendInSiteModel.site_image = uploadResults.site_image;
    //     dataToSendInSiteModel.buildings[0].flats[0].flat_image = uploadResults.flat_image;
    //     // const uploadResults = {};
    //     // for (const file of requiredFiles) {
    //     //     const fileArray = req.files[file];

    //     //     const fileUrls = await Promise.all(fileArray.map(async (fileItem) => {
    //     //         const uploadResult = await uploadImg(fileItem.path, fileItem.originalname);
    //     //         if (!uploadResult.success) {
    //     //             return res.status(500).json({ success: false, message: "Error uploading image" });
    //     //         }
    //     //         return uploadResult.url;
    //     //     }));

    //     //     uploadResults[file] = fileUrls;
    //     // }
    //     const newSite = new SiteModel(dataToSendInSiteModel);
    //     await newSite.save();
    //     const message = "Site Created Successfully";
    //     res.status(200).json({ success: true, message, result: newSite });
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ success: false, message: err.message });
    // }
};



const listSite = async (req, res) => {
    try {

        const listAll = await siteModel.find();


        if (listAll.length === 0) return res.status(204).json({ success: false, message: "No Record", result: [] });
        return res.status(200).json({ success: true, message: "fetched successfully", result: listAll });

    } catch (err) {
        // console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};





module.exports = {
    siteRegister,
    listSite
}