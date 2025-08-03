const express = require("express");
const router = express.Router();
const mapController = require("../controllers/map.controller");
const { query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/get-coordinates",
  [query("address").isString().notEmpty().withMessage("Address is required")],
  authMiddleware.authUser,
  mapController.getCoordinates
);

router.get(
  "/get-distance-time",
  [
    query("origin").isString().notEmpty().withMessage("Origin is required"),
    query("destination")
      .isString()
      .notEmpty()
      .withMessage("Destination is required"),
  ],
  authMiddleware.authUser,
  mapController.getDistanceAndTime
);

router.get(
  "/get-suggestions",
  [query("input").isString().notEmpty().withMessage("Input is required")],
  authMiddleware.authUser,
  mapController.getSuggestions
);

module.exports = router;
