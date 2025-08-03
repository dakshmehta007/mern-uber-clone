import React from "react";

const LookingForDriver = ({
  createRide,
  pickup,
  destination,
  fare,
  vehicleType,
  setVehicleFound,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
      <div className="mb-4">
        <h4 className="font-medium text-base">Pickup Location:</h4>
        <p className="text-sm text-gray-600">{pickup || "Not specified"}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-base">Destination:</h4>
        <p className="text-sm text-gray-600">
          {destination || "Not specified"}
        </p>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-base">Fare:</h4>
        <p className="text-sm text-gray-600">
          💸{fare?.[vehicleType] || "N/A"}
        </p>
      </div>
      <button
        onClick={() => {
          createRide(vehicleType);
          setVehicleFound(true);
        }}
        className="bg-black text-white px-4 py-2 rounded-lg w-full"
      >
        Confirm Ride
      </button>
    </div>
  );
};

export default LookingForDriver;
