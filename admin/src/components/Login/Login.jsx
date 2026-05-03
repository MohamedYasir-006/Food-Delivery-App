import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import API from "../../api"; // 🔥 use centralized API
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();

  const { admin, setAdmin, token, setToken } = useContext(StoreContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // handle input change
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔐 LOGIN FUNCTION
  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await API.post("/api/user/login", data);

      if (response.data.success) {
        const { token, role } = response.data;

        // store token
        setToken(token);
        localStorage.setItem("token", token);

        // role handling
        if (role === "admin") {
          setAdmin(true);
          localStorage.setItem("admin", true);

          toast.success("Admin Login Successful");
          navigate("/add");
        } else {
          setAdmin(false);
          toast.success("Login Successful");
          navigate("/"); // normal user route
        }

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // 🔄 redirect if already logged in
  useEffect(() => {
    if (admin && token) {
      navigate("/add");
    }
  }, [admin, token, navigate]);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">

        <div className="login-popup-title">
          <h2>Login</h2>
        </div>

        <div className="login-popup-inputs">
          <input
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            type="email"
            placeholder="Your email"
            required
          />

          <input
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        <button type="submit">Login</button>

      </form>
    </div>
  );
};

export default Login;