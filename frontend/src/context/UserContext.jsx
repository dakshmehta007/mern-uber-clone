import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  });
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve token from localStorage on initialization
    const storedToken = localStorage.getItem("authToken");
    console.log(
      "Token retrieved from localStorage in UserDataProvider:",
      storedToken
    );
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      console.log("Token updated in localStorage:", updatedToken);
      setToken(updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser, token, setToken }}>
      {isLoading ? <div>Loading...</div> : children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
