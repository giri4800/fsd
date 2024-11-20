import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

export default function LotView() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [centerQuery, setCenterQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    getAllLots();
  }, [searchQuery, centerQuery, currentPage]);

  const getAllLots = () => {
    fetch(`http://localhost:5000/getAllLots?search=${searchQuery}&center=${centerQuery}&page=${currentPage}&limit=${itemsPerPage}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      });
  };

  const logOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.clear();
      window.location.href = "./login";
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Lot Records</title>');
    printWindow.document.write(`
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        @media print {
          body { margin: 0; }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Lot Records</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write(`
      <thead>
        <tr>
          <th>Date</th>
          <th>Lot No</th>
          <th>Bales</th>
          <th>Center</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td>${item.date}</td>
            <td>${item.lotNo}</td>
            <td>${item.bales}</td>
            <td>${item.center}</td>
          </tr>
        `).join('')}
      </tbody>
    `);
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCenterSearch = (e) => {
    setCenterQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="auth-wrapper" style={{ marginTop: -90 }}>
      <div className="auth-inner">
        <h3>Lot Records</h3>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          
          <input
            type="text"
            placeholder="Search by Center..."
            onChange={handleCenterSearch}
            value={centerQuery}
            className="search-input"
          />
          <span className="record-info">
            {searchQuery || centerQuery ? `Records Found: ${data.length}` : `Total Records: ${data.length}`}
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Lot No</th>
                <th>Bales</th>
                <th>Center</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.date}</td>
                  <td>{item.lotNo}</td>
                  <td>{item.bales}</td>
                  <td>{item.center}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
        <div className="button-group">
          <button onClick={handlePrint} className="print-btn">
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
          <button onClick={logOut} className="logout-btn">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}