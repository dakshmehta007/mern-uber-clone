const RideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
const mapService = require("./maps.service");
const crypto = require("crypto");

const generateOtp = () => {
  // Use crypto.randomInt if available, otherwise fallback to Math.random
  const randomInt = crypto.randomInt
    ? crypto.randomInt(100000, 999999)
    : Math.floor(100000 + Math.random() * 900000);
  return randomInt;
};

const getOtp = () => {
  return generateOtp();
};

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const routeInfo = await mapService.getDistanceAndTime(pickup, destination);

  const BASE_FARE = {
    auto: 25,
    car: 50,
    moto: 20,
  };

  const RATE_PER_KM = {
    auto: 12,
    car: 15,
    moto: 10,
  };

  const RATE_PER_MINUTE = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fares = {
    auto: Math.round(
      BASE_FARE.auto +
        (routeInfo.distance.value / 1000) * RATE_PER_KM.auto +
        (routeInfo.duration.value / 60) * RATE_PER_MINUTE.auto
    ),
    car: Math.round(
      BASE_FARE.car +
        (routeInfo.distance.value / 1000) * RATE_PER_KM.car +
        (routeInfo.duration.value / 60) * RATE_PER_MINUTE.car
    ),
    moto: Math.round(
      BASE_FARE.moto +
        (routeInfo.distance.value / 1000) * RATE_PER_KM.moto +
        (routeInfo.duration.value / 60) * RATE_PER_MINUTE.moto
    ),
  };

  return {
    fares,
    distance: routeInfo.distance,
    duration: routeInfo.duration,
  };
};

module.exports.createRide = async ({
  userId,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error(
      "User ID, pickup, destination and vehicle type are required"
    );
  }

  const fareEstimate = await getFare(pickup, destination);
  const pickupCoords = await mapService.getAddressCoordinates(pickup);
  const destinationCoords = await mapService.getAddressCoordinates(destination);

  // Ensure correct GeoJSON format for coordinates
  const pickupLocation = {
    type: "Point",
    coordinates: [pickupCoords.lng, pickupCoords.lat], // Correct order: [longitude, latitude]
  };

  const destinationLocation = {
    type: "Point",
    coordinates: [destinationCoords.lng, destinationCoords.lat], // Correct order: [longitude, latitude]
  };

  const ride = await RideModel.create({
    user: userId,
    pickup: {
      address: pickup,
      location: pickupLocation,
    },
    destination: {
      address: destination,
      location: destinationLocation,
    },
    otp: getOtp(),
    vehicleType,
    fare: fareEstimate.fares[vehicleType],
    distance: fareEstimate.distance,
    duration: fareEstimate.duration,
  });

  return ride;
};

module.exports.getFareEstimate = getFare;

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  const ride = await RideModel.findOne({ _id: rideId });

  if (!ride) {
    throw new Error("Ride not found");
  }

  await RideModel.findOneAndUpdate(
    { _id: rideId },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const updatedRide = await RideModel
    .findOne({ _id: rideId })
    .populate("user")
    .populate("captain")
    .select("+otp");

  return updatedRide;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride ID and OTP are required");
  }

  console.log("Starting ride with ID:", rideId, "and OTP:", otp); // Log inputs

  const ride = await RideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate("user")
    .populate("captain")      
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found or captain mismatch");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride is not accepted yet");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await RideModel.findOneAndUpdate({
    _id: rideId,
  },
  {
    status: "started",
    })
  
  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: ride,
  })

  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }
  const ride = await RideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "started") {
    throw new Error("Ride is not started yet");
  }

  await RideModel.findOneAndUpdate(
    { _id: rideId },
    {
      status: "completed",
    }
  );

  return ride;
};
