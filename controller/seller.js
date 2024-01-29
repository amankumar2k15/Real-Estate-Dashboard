const adminSellersLinkModel = require("../model/adminSellersLinkModel");
const newModel = require("../model/newModel");
const sellerBuyersLinkModel = require("../model/sellerBuyersLinkModel");
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




const listSeller = async (req, res) => { 
    try {
        console.log("reaching api page for paginate seller listing ", req.query);
        const { page, limit, type } = req.query;
        // const query = { type: type }; // Construct your query based on type
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const totalCount = await userModel.countDocuments({ role: "seller" });
        const totalPages = Math.ceil(totalCount / pageSize);
        const sellersData = await adminSellersLinkModel.aggregate([
            { $match: { adminID: req.user.id } },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "sellerID",
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
            { $skip: (pageNumber - 1) * pageSize }, // Skip documents based on page number and limit
            { $limit: parseInt(pageSize) }
        ])

        const transformSeller = sellersData.map((item) => item.data).map(([seller]) => seller)
        const body = {
            total: totalCount,
            totalPages: totalPages,
            currentPage: pageNumber,
            sellers: transformSeller
        }


        return res.status(200).json({ success: true, result: body, message: `Seller and associated buyers fetched successfully` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Servr error" })
    }
}



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
    const sellerID = req.params.id;
    if (!sellerID) return res.status(400).json({ error: true, message: `Seller ID is missing` });
    try {
        // Find buyers associated with the seller
        const sellerData = await newModel.findOne({ _id: sellerID });
        if (!sellerData) {
            return res.status(404).json({ error: true, message: `Seller not found with ID ${sellerID}` });
        }
        // Extract buyer IDs
        const buyerIds = sellerData?.seller?.associated_buyers.map((link) => link.buyerId);

        // Update buyers' assigned key to false
        await userModel.updateMany(
            { _id: { $in: buyerIds } }, // Filter condition for the buyers
            { $set: { assigned: false } } // Update operation to set assigned to false
        );

        // Delete the seller and associated buyers links
        await newModel.deleteOne({ _id: sellerID });

        return res.status(200).json({ success: true, message: `Seller and associated buyers deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = {
    sellerById,
    deleteSeller,
    listSeller
};
