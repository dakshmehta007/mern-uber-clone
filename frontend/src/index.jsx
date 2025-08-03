import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserDataProvider } from "./context/UserContext";
import { CaptainDataProvider } from "./context/CaptainContext";

ReactDOM.render(
  <React.StrictMode>
    <UserDataProvider>
      <CaptainDataProvider>
        <App />
      </CaptainDataProvider>
    </UserDataProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
