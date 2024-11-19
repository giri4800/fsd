import React, { useState } from "react";

const LotForm = () => {
    const [formData, setFormData] = useState({
      date: "",
      lotNo: "",
      bales: "", // Keeping the property name as 'Bales'
      center: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleLogout = () => {
      if (window.confirm("Are you sure you want to log out?")) {
        window.localStorage.clear();
        window.location.href = "./login";
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
  
      try {
        const response = await fetch("http://localhost:5000/create-outward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Transit data saved successfully");
          setFormData({
            date: "",
            lotNo: "",
            bales: "", // Resetting 'Bales' correctly
            center: "",
          });
        } else {
          alert("Error saving transit data: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit data. Please try again later.");
      }
    };
  
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "400px",
          margin: "auto",
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Lot Details Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="date" style={{ display: "block", marginBottom: "5px" }}>
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
  
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="lotNo" style={{ display: "block", marginBottom: "5px" }}>
              Lot Number:
            </label>
            <input
              type="text"
              id="lotNo"
              name="lotNo"
              value={formData.lotNo}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
  
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="Bales" style={{ display: "block", marginBottom: "5px" }}>
              Number of Bales:
            </label>
            <input
              type="number"
              id="bales"
              name="bales" // Updated to match the 'Bales' property
              value={formData.Bales} // Updated to match 'Bales'
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
  
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="center" style={{ display: "block", marginBottom: "5px" }}>
              Center:
            </label>
            <input
              type="text"
              id="center"
              name="center"
              value={formData.center}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
  
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  };
  
  export default LotForm;
  