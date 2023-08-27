import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { loginUser } from './actions';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User({ action, onClose }) {
  console.log('action', action)
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleResponse = (response, successMessage) => {
    if (response.status === 200) {
      toast.success(successMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    onClose();
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("An error occurred", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      toast.error("Network error", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password, teamName };
    console.log('data',data)
    if (action === "Register") {
      axios
        .post("http://localhost:5000/auth/register", data)
        .then((response) => {
          handleResponse(response, response.data.message);
          alert('Registration Successful')
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      axios
        .post("http://localhost:5000/auth/login", data)
        .then((response) => {
          localStorage.setItem("token", response.data.token)
          const userData = response.data.user;
          dispatch(loginUser(userData));
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  return (
    <div className="uploadModalBox">
      <div className="uploadModal">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <label className="modalTitle">
          User {action === "Register" ? "Registration" : "Login"}
        </label>
        <div className="container">
          <form className="imageForm" onSubmit={handleSubmit}>
            <div className="inputContainer">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                className="inputField"
                onChange={handleUsernameChange}
                required  
              />
            </div>
            <div className="inputContainer">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                className="inputField"
                onChange={handlePasswordChange}
                required
              />
            </div>
            {action === "Register" && (
              <div className="inputContainer">
                <label>Team Name</label>
                <select
                  value={teamName}
                  className="inputField"
                  onChange={handleTeamNameChange}
                  required
                >
                  <option value=""> select team name </option>
                  <option value="hr"> HR </option>
                  <option value="frontend"> Frontend </option>
                  <option value="backend"> Backend </option>
                  <option value="accountant"> Accountant </option>
                </select>
              </div>
            )}
            <div className="submitButtonContainer">
              <input
                type="submit"
                value={action}
                className="submitButton"
              />
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default User;