import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import '../index.css'; // Import the CSS file

const TransportLinks = () => {
  const navigate = useNavigate(); // Initialize the navigate function

 

  return (
    <div className="transport-links-container">
      <a href="./userHome" className="transport-link">Rokhade Transit</a>
      <a href="./userHome1" className="transport-link">K.B Roadlines</a>
      <a href="./userHome2" className="transport-link">AJK Transports</a>
      
      
    </div>
  );
};

export default TransportLinks;

