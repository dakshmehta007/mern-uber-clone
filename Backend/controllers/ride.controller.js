const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

module.exports.createRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    if (!pickup || !destination || !vehicleType) {
      console.error("Missing required fields in request body");
      return res.status(400).json({
        message: "Pickup, destination, and vehicle type are required",
      });
    }

    const userId = req.user._id;

    // First get fare estimate
    const estimate = await rideService.getFareEstimate(
      pickup,
      destination,
      vehicleType
    );

    // Then create the ride with estimated values
    const ride = await rideService.createRide({
      userId,
      pickup,
      destination,
      vehicleType,
      fare: estimate.fare,
      distance: estimate.distance,
      duration: estimate.duration,
    });
    console.log("Ride created successfully:", ride);

    const pickupCoords = await mapService.getAddressCoordinates(pickup);
    console.log("Pickup coordinates:", pickupCoords);

    // Find the nearest captain in the radius
    const nearestCaptain = await mapService.getNearestCaptainInRadius(
      pickupCoords.lat,
      pickupCoords.lng,
      2, // 2 km radius
      vehicleType
    );

    if (!nearestCaptain) {
      console.error("No captains found in radius.");
      return res.status(404).json({ error: "No captains found in radius" });
    }

    console.log("Nearest captain:", nearestCaptain);

    // Send ride details to the nearest captain
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    sendMessageToSocketId(nearestCaptain.socketId, {
      event: "new-ride",
      data: rideWithUser,
    });

    res.status(201).json({ ride, nearestCaptain });
  } catch (error) {
    console.error("Ride controller error:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Add new endpoint for fare estimates
module.exports.getFareEstimate = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  try {
    const { pickup, destination } = req.query;

    const estimate = await rideService.getFareEstimate(pickup, destination);
    res.status(200).json(estimate);
  } catch (error) {
    console.error("Fare estimate error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { rideId } = req.body;

  try {
    if (!req.captain) {
      throw new Error("Captain information is missing from the request.");
    }

    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json(ride);
  } catch (error) {
    console.error("Error confirming ride:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.startRide = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { rideId, otp } = req.query;
  
  console.log("Starting ride with ID:", rideId); // Replace alert with console.log

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log("Ride status after starting:", ride.status); // Log the updated status

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.error("Error starting ride:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.endRide = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { rideId } = req.body; // Retrieve rideId from the request body

  try {
    const ride = await rideModel.findById(rideId); // Fetch the ride to check its status
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const updatedRide = await rideService.endRide({
      rideId,
      captain: req.captain,
    }); // Pass captain to the service

    sendMessageToSocketId(updatedRide.user.socketId, {
      event: "ride-ended",
      data: updatedRide,
    });

    res.status(200).json(updatedRide);
  } catch (error) {
    console.error("Error ending ride:", error);
    res.status(500).json({ message: error.message });
  }
};
