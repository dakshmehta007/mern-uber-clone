import React from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinishRide = (props) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );
      if (response.status === 200) {
        props.setFinishRidePanel(false); // Close the finish ride panel
        navigate("/captain/home"); // Redirect to home page after ending the ride
      }

    } catch (error) {
      console.error("Error ending ride:", error.message);
    }
  }
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride.</h3>
      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://th.bing.com/th/id/OIP.iattzUh9ORYsWdrgKMmAWAHaHU?w=174&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user?.fullname?.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            {/* //place icon here */}
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
                {props.ride?.fare || "N/A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full">
          <button
            onClick={endRide} // Correctly invoke the function
            className="w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
          >
            Finish Ride
          </button>
          {/* <p className='mt-10 text-xs'> Click on finish ride button if you have completed the payment.</p> */}
        </div>
      </div>
    </div>
  );
}

export default FinishRide
