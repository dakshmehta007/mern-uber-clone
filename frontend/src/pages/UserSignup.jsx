import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";


const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { user, setUser } = useContext(UserDataContext);

  const navigate = useNavigate();

  const submitHandler = async(e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios .post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate('/home');
    }
    
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-16 mb-10"
          src="https://logospng.org/download/uber/logo-uber-4096.png"
          alt="uber"
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <div className="flex gap-4 mb-6">
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="bg-customGrey w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              required
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
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
          <button className="bg-black text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Create account
          </button>
        </form>

        <p className="text-center ">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-xs leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and
          <span className="underline"> Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
