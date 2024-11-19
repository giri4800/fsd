import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

export default function LotView() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Define number of items per page

  useEffect(() => {
    getAllLots();
  }, [searchQuery, currentPage]);

  const getAllLots = () => {
    fetch(`http://localhost:5000/getAllLots?search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setTotalPages(Math.ceil(data.total / itemsPerPage)); // Update the total number of pages
      });
  };

  const logOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.clear();
      window.location.href = "./login";
    }
  };

  const deleteLot = (id, lotNo) => {
    if (window.confirm(`Are you sure you want to delete lot record with LotNo: ${lotNo}?`)) {
      fetch("http://localhost:5000/deleteLot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lotId: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          getAllLots();
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is made
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
            placeholder="Search by Lot No..."
            onChange={handleSearch}
            value={searchQuery}
            className="search-input"
          />
          <span className="record-info">
            {searchQuery ? `Records Found: ${data.length}` : `Total Records: ${data.length}`}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.date}</td>
                  <td>{item.lotNo}</td>
                  <td>{item.bales}</td>
                  <td>{item.center}</td>
                  <td>
                    <button
                      onClick={() => deleteLot(item._id, item.lotNo)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
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
        <button onClick={logOut} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}
