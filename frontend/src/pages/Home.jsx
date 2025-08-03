import React, { useRef, useState, useEffect, useContext } from "react";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import axios from "axios";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LocationSearchPanel from "../components/LocationSearchPanel";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import {useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const { token } = useContext(UserDataContext); // Access token from context
  const { sendMessage, receiveMessage } = useContext(SocketContext); // Access sendMessage and receiveMessage from SocketContext
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isPickupFieldActive, setIsPickupFieldActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user && user._id) {
      sendMessage("join", { userType: "user", userId: user._id });
    } else {
      console.warn("User ID is undefined. Waiting for user context to update.");
    }
  }, [user, sendMessage]);

  useEffect(() => {
    if (receiveMessage) {
      receiveMessage("ride-confirmed", (ride) => {
        setRide(ride); // Update ride state with the confirmed ride
        setVehicleFound(false);
        setVehiclePanel(true);
        setWaitingForDriver(true);
      });
    }
  }, [receiveMessage]);

  useEffect(() => {
    if (receiveMessage) { 
      receiveMessage("ride-started", (ride) => {  
        navigate("/riding", { state: { ride} }); // Redirect to the ride page
        setRide(ride); // Update ride state with the started ride
        setVehicleFound(false);
        setWaitingForDriver(false);
      });
    }
    })

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    setIsPickupFieldActive(true);
    if (value) {
      try {
        if (!token) {
          console.error(
            "Authentication token is missing. Please log in again."
          );
          alert("Session expired. Please log in again.");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: value },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching pickup suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    setIsPickupFieldActive(false);
    if (value) {
      try {
        if (!token) {
          console.error(
            "Authentication token is missing. Please log in again."
          );
          alert("Session expired. Please log in again.");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: value },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching destination suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const locationName = suggestion.description; // Extract the location name
    if (isPickupFieldActive) {
      setPickup(locationName); // Set the location name for pickup
    } else {
      setDestination(locationName); // Set the location name for destination
    }
    // setPanelOpen(false);
    setSuggestions([]);
  };

  useEffect(() => {
    if (panelOpen && panelRef.current && panelCloseRef.current) {
      gsap.to(panelRef.current, {
        height: "100%",
        duration: 0.5,
        padding: "24px",
      });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else if (panelRef.current && panelCloseRef.current) {
      gsap.to(panelRef.current, { height: "0", duration: 0.5 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  useEffect(() => {
    if (vehiclePanel && vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else if (vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [vehiclePanel]);

  useEffect(() => {
    if (confirmRidePanel && confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [confirmRidePanel]);

  useEffect(() => {
    if (vehicleFound && vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  useEffect(() => {
    if (waitingForDriver && waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [waitingForDriver]);

  // Delay rendering until token is available
  if (!token) {
    console.log(
      "Token is not available yet. Delaying Home component rendering."
    );
    return null;
  }

  async function createRide(vehicleType) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickup, // Ensure this is a valid string
          destination: destination, // Ensure this is a valid string
          vehicleType: vehicleType, // Correct field name
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Ride created successfully:", response.data);
    } catch (error) {
      console.error("Error creating ride:", error);
      if (error.response && error.response.status === 400) {
        alert("Invalid data sent to the server. Please check your inputs.");
      } else {
        alert("An error occurred while creating the ride. Please try again later.");
      }
    }
  }

  async function findTrip() {
    setPanelOpen(false);
    setVehiclePanel(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup: pickup, destination: destination },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.fares) {
        setFare(response.data.fares); // Correctly set the fares object
      } else {
        console.error("Fare data is missing in the response:", response.data);
        setFare({}); // Set an empty object as fallback
        alert("Unable to fetch fare. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching fare from backend:", error);
      setFare({}); // Set an empty object as fallback
      alert(
        "An error occurred while fetching the fare. Please check your network connection or try again later."
      );
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://th.bing.com/th/id/OIP.zEmVeB3nUierJmD1REuCMgHaCm?rs=1&pid=ImgDetMain"
        alt=""
      />
      <div
        onClick={() => {
          setVehiclePanel(false);
        }}
      >
        <div className="h-full w-full object-cover" >
          <LiveTracking />
        </div>
        {/* <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP.yXTbicvoODRb336A2b78KwHaHa?rs=1&pid=ImgDetMain"
          alt=""
        /> */}
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-5 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 rigtht-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-s-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold ">Find a trip</h4>
          <form className="relative py-3" onSubmit={(e) => submitHandler(e)}>
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-grey-700 rounded-full"></div>
            <input
              className="bg-whiteshade px-12 py-2 text-base rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pick-up location"
              value={pickup}
              onChange={handlePickupChange}
              onClick={() => setPanelOpen(true)}
            />
            <input
              className="bg-whiteshade px-12 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={handleDestinationChange}
              onClick={() => setPanelOpen(true)}
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg w-full"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white h-0 ">
          <LocationSearchPanel
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed bottom-0 translate-y-full z-10 w-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 translate-y-full z-10 w-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed bottom-0 translate-y-full z-10 w-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 translate-y-full z-10 w-full bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
