import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LiveTracking = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map("map", {
      zoomControl: true, // Enable zoom controls
    }).setView([20.5937, 78.9629], 5); // Default to India

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Watch the user's location
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });

        // Update the map and marker
        if (!markerRef.current) {
          markerRef.current = L.marker([latitude, longitude]).addTo(
            mapRef.current
          );
        } else {
          markerRef.current.setLatLng([latitude, longitude]);
        }

        mapRef.current.setView([latitude, longitude], 15); // Center the map on the user's location
      },
      (err) => {
        console.error("Error getting location:", err);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId); // Stop watching the location on component unmount
      mapRef.current.remove(); // Clean up the map instance
    };
  }, []);

  return (
    <div>
      <div
        id="map"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: "-10",
        }}
      ></div>
      {/* {position && (
        <p className="text-center mt-2">
          Current Location: Latitude {position.lat}, Longitude {position.lng}
        </p>
      )} */}
    </div>
  );
};

export default LiveTracking;
