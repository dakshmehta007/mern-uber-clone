import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken"); // Use the correct key
      console.log("Token found:", token);

      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log("Request headers:", headers);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers,
          }
        );
        console.log("User profile response:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
