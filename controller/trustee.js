const adminTrusteeLinkModel = require("../model/sellerBuyersLinkModel");
const sellerModel = require("../model/sellorModel");
const userModel = require("../model/userModel");

/*

Roles of admin ============================> 

approv trustee 
filter trustee 
search trustee 
paginate trustee 
get individual trustee
delete trustee 

*/








const deleteTrustee = async (req, res) => {
    const sellerId = req.params.id
    if(!sellerId)   return res.status(200).json({ error: true, message: `seller id is missing` })
    try {
        // Find buyers associated with the seller
        const sellerLink = await adminTrusteeLinkModel.find({ sellerId });
    
        // Extract buyer ids
        const sellerIDs = sellerLink.map((link) => link.buyerId);
    
        // Delete buyers
        await userModel.deleteMany({ _id: { $in: sellerIDs } });
    
        // Delete seller links
        await adminTrusteeLinkModel.deleteMany({ sellerId });
    
        return res.status(200).json({ success: true, message: `Trustee  deleted successfully` })
      } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}


module.exports = {
    listSeller,
    deleteTrustee
};
