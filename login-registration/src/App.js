import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login_component"; // Your login component
import SignUp from "./components/signup_component";
import UserHome from "./components/userHome";
import UserHome2 from "./components/userHome2";
import UserHome1 from "./components/userHome1"; // Ensure the case matches your file name
import HomePage from "./components/homePage"; 
import Navbar from "./components/Navbar";
import AdminHome from "./components/adminHome";
import Product from "./components/products";
import About from "./components/about";
import View from "./components/view";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true"; // Check if user is logged in
  const userType = window.localStorage.getItem("userType");

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} userType={userType} />

        <Routes>
          {/* Default route to show Login page if not logged in */}
          <Route path="/" element={isLoggedIn ? <Navigate to={userType === "Admin" ? "/admin-dashboard" : "/homePage"} /> : <Login />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          {/* Protect routes that require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/userHome" element={<UserHome />} />
            <Route path="/userHome1" element={<UserHome1 />} />
            <Route path="/userHome2" element={<UserHome2 />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/products" element={<Product />} />
            <Route path="/admin-dashboard" element={<AdminHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/view" element={<View/>} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to login if route not found */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
