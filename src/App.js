// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import User from "./User";
import { loginUser, logoutUser } from "./actions";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "./Dashboard";
import axios from "axios";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [action, setAction] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_VERCEL_ENV}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        })
        .then((response) => {
          dispatch(loginUser(response.data));
        });
    }
  }, [isLogin]);

  function handleAuthClick(event) {
    setAction(event.target.value);
    setIsOpen(!isOpen);
  }

  if (!token) {
    return (
      <div>
        <div className="uploadModalBox" style={{ flexDirection: "column" }}>
          <p>Please login to access the dashboard.</p>
          <div style={{gap:"20px", display: "flex"}}>
          <button
            className="submitButton"
            value="Login"
            onClick={handleAuthClick}
          >
            Login
          </button>
          <button
            className="submitButton"
            value="Register"
            onClick={handleAuthClick}
          >
            Register
          </button>
          </div>
        </div>
        {isOpen && <User action={action} onClose={() => setIsOpen(false)} />}
      </div>
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="header">
          <h2>Welcome, {user?.username}!</h2>
          <p
            className="submitButton"
            onClick={() =>
              dispatch(logoutUser(), localStorage.removeItem("token"))
            }
          >
            Logout
          </p>
        </div>
        <Dashboard />
      </div>
    </>
  );
};

export default App;
