import React, { useEffect, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";

export default function TransitView() {
  const [data, setData] = useState([]);
  const [centerQuery, setCenterQuery] = useState(""); // for center search
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalBales, setTotalBales] = useState(0);
  const [centerTotalBales, setCenterTotalBales] = useState(0); // total bales for searched center
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 8;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchTransitData();
  }, [centerQuery, fromDate, toDate, currentPage]);

  const fetchTransitData = () => {
    const url = new URL('http://localhost:5000/getAllTransits');
    const params = new URLSearchParams({
      centerQuery: centerQuery, // Send center query parameter
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      page: currentPage
    });
    url.search = params.toString();

    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedData = data.data.map(item => ({
            ...item,
            date: formatDate(item.date)
          }));
          setData(formattedData);
          setTotalBales(data.totalBales || 0);
          setCenterTotalBales(data.centerTotalBales || 0); // Set center-specific total bales
          setTotalPages(Math.ceil(data.totalRecords / recordsPerPage));
        } else {
          setData([]);
          setTotalBales(0);
          setCenterTotalBales(0);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setData([]);
        setTotalBales(0);
        setCenterTotalBales(0);
        setTotalPages(1);
      });
  };

  const handleCenterQueryChange = (e) => {
    setCenterQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (field, value) => {
    if (field === "fromDate") {
      setFromDate(value);
      if (toDate && new Date(value) > new Date(toDate)) {
        setToDate(value);
      }
    }
    if (field === "toDate") {
      if (!fromDate || new Date(value) >= new Date(fromDate)) {
        setToDate(value);
      }
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const logOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.clear();
      window.location.href = "./login";
    }
  };

  return (
    <div className="auth-wrapper" style={{ marginTop: -90 }}>
      <div className="auth-inner">
        <h3>Transit Records</h3>

        <div className="search-filters">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Center..."
              value={centerQuery}
              onChange={handleCenterQueryChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="date-filters">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateFilterChange("fromDate", e.target.value)}
            className="date-input"
            max={toDate || undefined}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateFilterChange("toDate", e.target.value)}
            className="date-input"
            min={fromDate || undefined}
          />
        </div>

        <div className="bales-summary">
          <div className="total-bales">
            <span>Total Bales: {totalBales}</span>
          </div>
          
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>LotNo</th>
                <th>No of bales</th>
                <th>Eway-bill</th>
                <th>L.R No</th>
                <th>Vehicle No</th>
                <th>Center</th>
                <th>Factory</th>
                <th>TO</th>
                <th>UD No</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.date}</td>
                  <td>{item.invoice}</td>
                  <td>{item.lotNo}</td>
                  <td>{item.bales}</td>
                  <td>{item.ewayNo}</td>
                  <td>{item.lrNo}</td>
                  <td>{item.vehicleNo}</td>
                  <td>{item.center}</td>
                  <td>{item.factory}</td>
                  <td>{item.to}</td>
                  <td>{item.udNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <button onClick={logOut} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}
