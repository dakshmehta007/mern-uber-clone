const captainModel = require("../models/captain.model");
const bcrypt = require("bcryptjs");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }
  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashedPassword,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });

  return captain;
};

module.exports.updateCaptainLocation = async (captainId, location) => {
  try {
    const geoLocation = {
      type: "Point",
      coordinates: [location.lng, location.lat], // GeoJSON format: [longitude, latitude]
    };


    const updatedCaptain = await captainModel.findByIdAndUpdate(
      captainId,
      { location: geoLocation },
      { new: true }
    );

    return updatedCaptain;
  } catch (error) {
    console.error("Error updating captain location:", error);
    throw new Error("Error updating captain location");
  }
};
