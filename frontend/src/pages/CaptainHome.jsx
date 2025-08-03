import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { captain, token } = useContext(CaptainDataContext); // Access token from context

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (sendMessage) {
            sendMessage("join", {
              userId: captain._id,
              userType: "captain",
            });
            console.log("Socket connected for captain:", captain._id);
            console.log("Captain Token:", token); // Log the token

            // Send location updates every 10 seconds
            const locationInterval = setInterval(() => {
              sendMessage("update-location-captain", {
                captainId: captain._id,
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              });
            }, 10000);

            return () => clearInterval(locationInterval);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation not available");
    }
  }, [captain, sendMessage, token]);

  useEffect(() => {
    if (receiveMessage) {
      receiveMessage("new-ride", (data) => {
        console.log("New ride received:", data);
        setRide(data);
        setRidePopUpPanel(true);
      });
    }
  }, [receiveMessage]);

  useEffect(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [ridePopUpPanel]);

  useEffect(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [confirmRidePopUpPanel]);

  async function confirmRide() {
    try {
      console.log("Captain Token:", token); // Debugging: Log the token
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from context
          },
        }
      );

      console.log("Ride confirmed successfully:", response.data);
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
      } else {
        alert("An error occurred while confirming the ride. Please try again.");
      }
    }
  }

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://th.bing.com/th/id/OIP.zEmVeB3nUierJmD1REuCMgHaCm?rs=1&pid=ImgDetMain"
          alt=""
        />
        <Link
          to="/home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP.yXTbicvoODRb336A2b78KwHaHa?rs=1&pid=ImgDetMain"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 translate-y-full z-10 w-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed bottom-0 translate-y-full z-10 h-screen w-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
