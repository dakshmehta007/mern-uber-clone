const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup").notEmpty().withMessage("Pickup location is required"),
    body("destination").notEmpty().withMessage("Destination is required"),
    body("vehicleType")
      .notEmpty()
      .isIn(["car", "moto", "auto"])
      .withMessage("Valid vehicle type is required"),
  ],
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  [
    query("pickup").notEmpty().withMessage("Pickup location is required"),
    query("destination").notEmpty().withMessage("Destination is required"),
  ],
  rideController.getFareEstimate
);

router.post(
  "/confirm",
  authMiddleware.authCaptain, // Ensure this middleware is applied
  [body("rideId").isMongoId().withMessage("Invalid ride ID")],
  rideController.confirmRide
);

router.get(
  "/start-ride",
  authMiddleware.authCaptain, // Ensure this middleware is applied
  query("rideId").isMongoId().withMessage("Invalid ride ID"),
  query("otp").notEmpty().withMessage("OTP is required"),
  rideController.startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  [
    body("rideId").isMongoId().withMessage("Invalid ride ID"), // Validate rideId in the request body
  ],
  rideController.endRide
);

module.exports = router;
