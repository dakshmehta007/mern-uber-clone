const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const coordinates = await mapService.getAddressCoordinates(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Map controller error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getDistanceAndTime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;
    // if (!origin || !destination) {
    //   return res.status(400).json({ message: "Origin and destination are required" });
    // }

    const distanceAndTime = await mapService.getDistanceAndTime(origin, destination);
    res.status(200).json(distanceAndTime);
  } catch (error) {
    console.error("Map controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const suggestions = await mapService.getAddressSuggestions(input);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Map controller error:", error);
    res.status(500).json({ message: error.message });
  }
}