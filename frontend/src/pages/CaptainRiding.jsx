import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const finishRidePanelRef = useRef(null);
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const location = useLocation();
  const rideData = location.state?.ride || null; // Get ride data from location state

  useEffect(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://th.bing.com/th/id/OIP.zEmVeB3nUierJmD1REuCMgHaCm?rs=1&pid=ImgDetMain"
          alt=""
        />

        <Link
          to="/captain/home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-1/2">
        <LiveTracking />
      </div>

      <div
        className="h-1/5 p-6 flex items-center justify-between fixed bottom-6 left-0 w-full bg-yellow-400 pt-10"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[90%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 KM away</h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed bottom-0 translate-y-full z-20 w-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
}; 

export default CaptainRiding;
