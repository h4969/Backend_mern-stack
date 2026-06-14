
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const verifyToken = async (req, res, next) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // ← add this line
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token is required" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    req.vendorId = vendor._id;
    req.vendor = vendor;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;