

const sellorModel = require("../model/sellorModel");
const { uploadImg } = require("../utils/cloudinary");


const sellerRegistration = async (req, res) => {
    const user = req.body;
 // aman works here
    try {
        const newUser = new sellorModel(user)
        const uploadResult = await uploadImg(req.file.path, req.file.originalname);

        if (!uploadResult.success) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image"
            })
        }
        // Update the user's imageURL with the Cloudinary URL
        newUser.profilePicture = uploadResult.url;

        await newUser.save();
        let message = `Your account is registered successfully and Bharat Escrow will let you know when you account is approved`
        await sendEmail({ username: newUser.fullName, email: newUser.email, phone: newUser.phone, subject: "Sellor request registered successfully", message: message })
        res.status(200).json({
            success: true,
            message: message,
            result: newUser
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}


module.exports = {
    sellerRegistration
}