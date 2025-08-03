import React, { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride || {}; // Use an empty object as a fallback
  const navigate = useNavigate(); // Initialize useNavigate hook

  console.log("Ride data lleee:", ride); // Log the ride data for debugging

  const { receiveMessage } = useContext(SocketContext); // Access sendMessage and receiveMessage from SocketContext

  useEffect(() => {
    if (receiveMessage) {
      receiveMessage("ride-ended", () => {
        navigate("/home");
      });
    }
  });

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className=" text-lg font-medium ri-home-8-line"></i>
      </Link>

      <div className="h-1/2">
        <LiveTracking />
      </div>
      <div className="h-1/2 p-4 bg-white shadow-lg rounded-t-lg">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src="https://th.bing.com/th/id/OIP.iattzUh9ORYsWdrgKMmAWAHaHU?w=174&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt=""
          />
          <div className="text-right">
            <h2 className="text-lg font-medium">
              {ride?.captain?.fullname?.firstname || "N/A"}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain?.vehicle?.plate || "N/A"}
            </h4>
            <p className="text-sm text-gray-600">
              {ride?.captain?.vehicle?.vehicleType || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className=" text-lg ri-map-pin-user-fill"></i>
              <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.destination?.address || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>

              <div>
                <h3 className="text-lg font-medium">{ride?.fare || "N/A"}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
