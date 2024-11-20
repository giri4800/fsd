import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Navbar = ({ isLoggedIn, userType }) => {
  const location = useLocation(); // Get the current location of the user

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {/* Common Navigation for All Users */}
        {!isLoggedIn && (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </>
        )}

        

        {/* If the user is on the /about page */}
        {isLoggedIn && location.pathname === "/about" && (
          <>
            
            <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Home
              </Link>
            </li>
          </>
        )}

        {/* If the user is on /userHome1 */}
        {isLoggedIn && location.pathname === "/userHome1" && (
          <>
          <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Home
              </Link>
            </li>
           
            <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Back
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                View
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && location.pathname === "/userHome" && (
          <>
          <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Home
              </Link>
            </li>
           
           
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                View
              </Link>
            </li>
            
            
          </>
        )}
        {/* If the user is on /userHome2 */}
        {isLoggedIn && location.pathname === "/userHome2" && (
          <>

          <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Back
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/view" className="nav-link">
                View
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/homePage" className="nav-link">
                Home
              </Link>
            </li>
             
          </>
        )}

        {/* If the user is on the /view page */}
        {isLoggedIn && location.pathname === "/view" && (
          <li className="nav-item">
            <Link to="/userHome2" className="nav-link">
              Back
            </Link>
          </li>
        )}

        {/* Conditional Rendering Based on User Type */}
        {isLoggedIn && userType === "Admin" && location.pathname !== "/view" && (
          <li className="nav-item">
            <Link to="/admin-dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
