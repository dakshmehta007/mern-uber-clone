import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(UserDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        console.log("Token stored:", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }

    setPassword("");
    setEmail("");
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
          <Link to={"/signup"} className="text-blue-600">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to={"/captain/login"}
          className="bg-lightGreen flex item-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
