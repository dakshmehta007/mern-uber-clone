const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  pickup: {
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
  },
  destination: {
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "started", "completed", "cancelled"],
    default: "pending",
  },
  fare: {
    type: Number,
    required: true,
  },
  distance: {
    text: String,
    value: Number,
  },
  duration: {
    text: String,
    value: Number,
  },
  vehicleType: {
    type: String,
    enum: ["car", "moto", "auto"],
    required: true,
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },
  otp: {
    type: String,
    select: false,
    required: true,
  },
});

const rideModel = mongoose.model("ride", rideSchema);
module.exports = rideModel;
