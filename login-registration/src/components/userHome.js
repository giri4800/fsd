import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.css";

const UserHome = () => { 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        invoice: '',
        lotNo: '',
        vehicleNo: '',
        ewayNo: '',
        factory: '',
        center: '',
        to: '',
        udNo: '',
        lrNo: '',
        bales: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
 
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
          window.localStorage.clear();
          window.location.href = "./login";
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        try {
            const response = await fetch('http://localhost:5000/create-transit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Transit data saved successfully');
                setFormData({
                    date: '',
                    invoice: '',
                    lotNo: '',
                    vehicleNo: '',
                    ewayNo: '',
                    factory: '',
                    center: '',
                    to: '',
                    udNo: '',
                    lrNo: '',
                    bales: '',
                });
            } else {
                alert('Error saving transit data: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit data. Please try again later.');
        }
    };

    return (
        <div className="main-container">
            <button
                onClick={handleLogout}
                className="logout-btn"
            >
                Logout
            </button>
            <div className="form-container">
                <h2 className="form-heading">
                  Rokhade Transit:
                </h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <label htmlFor="date" className="label">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <label htmlFor="invoice" className="label">Invoice:</label>
                    <input
                        type="text"
                        id="invoice"
                        name="invoice"
                        value={formData.invoice}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter Invoice Number"
                    />
                    <label htmlFor="lotNo" className="label">Lot No:</label>
                    <input
                        type="text"
                        id="lotNo"
                        name="lotNo"
                        value={formData.lotNo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter Lot Number"
                    />
                    <label htmlFor="vehicleNo" className="label">Vehicle No:</label>
                    <input
                        type="text"
                        id="vehicleNo"
                        name="vehicleNo"
                        value={formData.vehicleNo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter Vehicle Number"
                    />
                    <label htmlFor="ewayNo" className="label">E-way No:</label>
                    <input
                        type="text"
                        id="ewayNo"
                        name="ewayNo"
                        value={formData.ewayNo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter E-way Number"
                    />
                    <label htmlFor="factory" className="label">Factory:</label>
                    <input
                        type="text"
                        id="factory"
                        name="factory"
                        value={formData.factory}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter Factory Name"
                    />
                    <label htmlFor="centre" className="label">Center:</label>
                    <select
                        id="center"
                        name="center"
                        value={formData.centre}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">Select Centre</option>
                        <option value="Afzalapur">Afzalapur</option>
                        <option value="Bijapur">Bijapur</option>
                        <option value="Devadurga">Devadurga</option>
                        <option value="Gulbarga">Gulbarga</option>
                        <option value="Jewargi">Jewargi</option>
                        <option value="Shahapur">Shahapur</option>
                        <option value="Shorapur">Shorapur</option>
                        <option value="Siridagi">Siridagi</option>
                        <option value="Yadgiri">Yadgiri</option>
                    </select>
                    <label htmlFor="to" className="label">To:</label>
                    <input
                        type="text"
                        id="to"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter To Location"
                    />
                    <label htmlFor="udNo" className="label">UD No:</label>
                    <input
                        type="text"
                        id="udNo"
                        name="udNo"
                        value={formData.udNo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter UD Number"
                    />
                    <label htmlFor="lrNo" className="label">LR No:</label>
                    <input
                        type="text"
                        id="lrNo"
                        name="lrNo"
                        value={formData.lrNo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter LR Number"
                    />
                    <label htmlFor="bales" className="label">Bales:</label>
                    <input
                        type="text"
                        id="bales"
                        name="bales"
                        value={formData.bales}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter Bales Count"
                    />
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserHome;
