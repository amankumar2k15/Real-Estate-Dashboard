const sellerBuyersLinkModel = require("../model/sellerBuyersLinkModel");
const sellerModel = require("../model/sellorModel");
const userModel = require("../model/userModel");

/*

Roles of admin ============================> 

approv seller 
filter seller 
search seller 
paginate seller 
get individual seller
delete seller 

*/



const sellerById = async (req, res) => {
    const sellerId = req.params.id
    if (!sellerId) return res.status(200).json({ error: true, message: `seller id is missing` })
    try {

        const buyersData = await sellerBuyersLinkModel.aggregate([
            { $match: { sellerID: sellerId } },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "buyerID",
                    foreignField: "_id",
                    as: "data"
                }
            },
            {
                $project: {

                    data: {
                        username: 1,
                        email: 1,
                        _id: 1,
                        phone: 1,
                        companyName: 1,
                        location: 1,
                        state: 1,
                        city: 1,
                        approved: 1,
                    }
                }
            },
        ]);

        const fetchUserData = await userModel.findOne({ _id: sellerId })

        let body = {
            personalInfo: fetchUserData,
            buyers: buyersData,
            totalBuyers: buyersData.length != 0 ? buyersData.length : 0,
            activeBuyers: 0,
            pendingBuyers: 0
        }
        return res.status(200).json({ success: true, result: body, message: `Seller and associated buyers fetched successfully` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}





const deleteSeller = async (req, res) => {
    const sellerID = req.params.id
    if (!sellerID) return res.status(200).json({ error: true, message: `seller id is missing` })
    try {
        // Find buyers associated with the seller
        const buyerLinks = await sellerBuyersLinkModel.find({ sellerID });

        // Extract buyer ids
        const buyerIds = buyerLinks.map((link) => link.buyerID);

        // Delete buyers
        await userModel.deleteMany({ _id: { $in: buyerIds } });

        // Delete seller links
        await sellerBuyersLinkModel.deleteMany({ sellerID });

        // Delete the seller
        await userModel.deleteOne({ _id: sellerID });
        return res.status(200).json({ success: true, message: `Seller and associated buyers deleted successfully` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}


module.exports = {
    sellerById,
    deleteSeller
};
