import React, { Component, useState } from "react";
import "../App.css";
import { Navigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister"); // Log the response to check firm and other values
        if (data.status === "ok") {
          console.log(data.userType); // Log userType and firm
    
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("userType", data.userType);
          window.localStorage.setItem("loggedIn", true);
    
          if (data.userType === "Admin") {
            window.location.href = "./admin-dashboard";
          } else {
            window.location.href = "./userDetails";
          }
        } else {
          alert("Login failed: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
    }    
  return (
    <div className="auth-wrapper1">
      <div className="auth-inner1">
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
