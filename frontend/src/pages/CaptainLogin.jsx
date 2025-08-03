import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginCaptain } = useContext(CaptainDataContext); // Use loginCaptain from context

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting login form with data:", { email, password }); // Log the request payload

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
        { email, password }
      );
      console.log("Login successful:", response.data); // Log the response
      if (response.status === 201) {
        const data = response.data;
        loginCaptain(data.captain, data.token); // Call loginCaptain
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);
        navigate("/captain/home");
      } else {
        console.error("Login failed with status:", response.status);
      }
    } catch (error) {
      console.error("Login failed:", error); // Log the error
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password. Please try again.");
      } else {
        alert("An error occurred during login. Please try again later.");
      }
    }

    setPassword("");
    setEmail("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-16 mb-10"
          src="https://freelogopng.com/images/all_img/1659761425uber-driver-logo-png.png"
          alt="uber"
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            className="bg-customGrey mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-customGrey mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          <button className="bg-black text-white font-semibold mb-6 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>

        <p className="text-center ">
          New here?{" "}
          <Link to={"/captain/signup"} className="text-blue-600">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to={"/login"}
          className="bg-lightGreen flex item-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
