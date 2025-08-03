import React, { createContext, useState, useEffect } from "react";

export const CaptainDataContext = createContext();

export const CaptainDataProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("captainToken");
    if (storedToken) {
      setToken(storedToken);
      // Optionally, fetch captain details using the token
    }
  }, []);

  const loginCaptain = (captainData, token) => {
    setCaptain(captainData);
    setToken(token);
    localStorage.setItem("captainToken", token);
  };

  const logoutCaptain = () => {
    setCaptain(null);
    setToken(null);
    localStorage.removeItem("captainToken");
  };

  return (
    <CaptainDataContext.Provider
      value={{ captain, token, setCaptain, loginCaptain, logoutCaptain }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainDataProvider;
