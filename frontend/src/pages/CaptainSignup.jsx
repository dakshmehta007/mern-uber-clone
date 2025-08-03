import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const { setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptain = {
      email,
      password,
      fullname: { firstname, lastname },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/register`,
        newCaptain
      );
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);
        navigate("/captain/home");
      }
    } catch (error) {
      console.error("Error registering captain:", error);
    }

    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="py-5 px-5 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20 mb-5"
          src="https://freelogopng.com/images/all_img/1659761425uber-driver-logo-png.png"
          alt="uber"
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg w-full font-medium mb-2">
            What's our Captain's name
          </h3>
          <div className="flex gap-4 mb-7">
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">
            What's our Captain's email
          </h3>
          <input
            className="bg-customGrey mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-customGrey mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <h3 className="text-lg font-medium mb-2">Vehicle Details</h3>
          <div className="flex gap-4 mb-7">
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mb-7">
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="Vehicle Plate Number"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
            <select
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <button className="bg-black text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Create Captain Account
          </button>
        </form>

        <p className="text-center ">
          Already have an account?{" "}
          <Link to={"/captain/login"} className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] mt-6 leading-right">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and
          <span className="underline"> Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
