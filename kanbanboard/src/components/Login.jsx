// src/components/Login.jsx
import InputField from "./InputField";
import Button from "./Button";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Login = ({setAuthToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/auth/login", {email, password});
      console.log(response);
      const {token} = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", response.data._id);
      localStorage.setItem("userRole", response.data.role);

      if(response.data.role === "admin") {
        console.log("admin it is");
        navigate('/admin/dashboard');
      } else if(response.data.role === "manager") {
        console.log("manager it is");
        navigate('/manager/dashboard');
      }  else if(response.data.role === "user") {
        console.log("user it is");
        navigate('/user/dashboard');
      } 
      console.log("check done");

      alert("Login successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
          LOGIN
        </h2>
        <form>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button text="Login" onClick={handleLogin} />
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="text-center text-gray-600 mt-4">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  setAuthToken: PropTypes.func.isRequired,
}

export default Login;