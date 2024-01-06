const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_KEY = process.env.JWT_KEY
const { error } = require("../helper/baseResponse");

const authenticate = (req, res, next) => {

  const userToken = req.headers.authorization;

  if (!userToken) {
    return res
      .status(401)
      .json(error("Please authenticate using a token", 401));
  }
  
  try {
    let token = userToken.split(" ");
    const JWT_TOKEN = token[1];
    const data = jwt.verify(JWT_TOKEN, process.env.JWT_KEY);
    req.user = data;
    next();
  } catch (err) {
    return res.status(500).json(error("Expired token or invalid", 500));
  }
};

module.exports = authenticate;
