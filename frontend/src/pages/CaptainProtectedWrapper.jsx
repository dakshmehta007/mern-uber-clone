import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = ({ children }) => {
  const { captain, token, setCaptain } = useContext(CaptainDataContext); // Ensure setCaptain is destructured

  useEffect(() => {
    const fetchCaptain = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:4000/captain/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Captain profile response:", data);

        if (response.ok) {
          setCaptain(data.captain); // Use setCaptain to update the context
        } else {
          console.error("Error fetching captain profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching captain profile:", error);
      }
    };

    fetchCaptain();
  }, [token, setCaptain]);

  if (!token) {
    console.log("Token not found, redirecting to login...");
    return <Navigate to="/captain/login" />;
  }

  return captain ? children : <div>Loading...</div>;
};

export default CaptainProtectedWrapper;
