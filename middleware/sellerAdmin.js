const { error } = require("../helper/baseResponse");

const checkSellerAdmin = async (req, res, next) => {
  try {
    if (req.user.role != "seller") {
      return res.status(403).json(error("You are not Seller", 403));
    } else {
      return next()
    }
  } catch (err) {
    return res.status(500).json(error(err.message, 500))
  }
}


module.exports = checkSellerAdmin