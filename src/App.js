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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  useEffect(()=>{
    if(token)
    {
      console.log('token', token)
        axios.get("http://localhost:5000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the headers
          }
        })
        .then((response)=>{
          console.log('resp', response)
          dispatch(loginUser(response.data));
        })
    }
  },[isLogin])
  console.log('user', user)

  if (!token) {
    return (
      <div>
        <div className="uploadModalBox" style={{flexDirection: 'column'}}>
          <p>Please login to access the dashboard.</p>
          <button
            className="submitButton"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Login
          </button>
        </div>
        {isOpen && <User onClose={() => setIsOpen(false)}/>}
      </div>
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="header">
        <h2>Welcome, {user?.username}!</h2>
        <p className="submitButton" onClick={() => dispatch(logoutUser(),localStorage.removeItem("token"))}>Logout</p>
        </div>
        <Dashboard />
      </div>
    </>
  );
};

export default App;
