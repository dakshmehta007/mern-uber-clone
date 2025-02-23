const express = require("express");
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least6 characters long"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at  least 3 characters long"),
    body("vehicle.color").isLength({ min: 3 }).withMessage("Color must be at least 3    characters long"),
    body("vehicle.plate").isLength({ min: 3 }).withMessage("Plate must be at least 3    characters long"),
    body("vehicle.capacity").isLength({ min: 1 }).withMessage("Capacity must be at least    1 passenger"),
    body("vehicle.vehicleType").isLength({ min: 3 }).withMessage("Vehicle type must be at   least 3 characters long")
    
], captainController.registerCaptain);

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least6 characters long")
], captainController.loginCaptain);

router.get("/profile", authMiddleware.authCaptain, captainController.getProfile);
router.post("/logout", authMiddleware.authCaptain, captainController.logoutCaptain);


module.exports = router;