import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting startRide request with rideId:", props.ride._id, "and OTP:", otp); // Log inputs

    try {
      const token = localStorage.getItem("captainToken"); // Ensure the token is retrieved
      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
      } 

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          params: {
            rideId: props.ride._id,
            otp,
          },
        }
      );

      console.log("startRide response:", response.data); // Log the response
      if (response.status === 200) {
        props.setConfirmRidePopUpPanel(false);
        props.setRidePopUpPanel(false);
        navigate("/captain/riding", { state: { ride: props.ride } });
      }
    } catch (error) {
      console.error("Error starting ride:", error.response?.data || error.message);
      alert("Failed to start the ride. Please check the OTP and try again.");
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setRidePopUpPanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm this ride to Start</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://www.pngall.com/wp-content/uploads/8/Driver-PNG-Images.png"
            alt="Driver Profile"
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname?.firstname || "N/A"}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className=" text-lg ri-map-pin-user-fill"></i>

            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup?.address || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination?.address || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>

            <div>
              <h3 className="text-lg font-medium">
                $ ${props.ride?.fare || "N/A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          <form onSubmit={submitHandler}>
            <label htmlFor="otp" className="block text-lg font-medium">
              Enter OTP:
            </label>
            <input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="px- font-mono py-4 text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
              required
            />

            <button
              type="submit"
              className="w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopUpPanel(false);
                props.setRidePopUpPanel(false);
              }}
              className="w-full mt-1 bg-red-600 text-white font-semibold p-3 rounded-lg text-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
