const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const jwt = require("jsonwebtoken");
const blackListToken = require("../models/blackListToken.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const isBlackListed = await blackListToken.findOne({ token: token });
  if (isBlackListed)
    return res.status(401).json({
      message: "Unauthorized Token",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "Unauthorized User" });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("Token received:", token); // Debugging: Log the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded.id);

    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }

    req.captain = captain; // Attach captain to the request object
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
