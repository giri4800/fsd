import React, { useEffect, useState } from "react";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";

export default function TransitView() {
  const [data, setData] = useState([]);
  const [centerQuery, setCenterQuery] = useState(""); 
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalBales, setTotalBales] = useState(0);
  const [centerTotalBales, setCenterTotalBales] = useState(0);
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
      centerQuery: centerQuery,
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
          setCenterTotalBales(data.centerTotalBales || 0);
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

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'height=500, width=800');
    
    // Construct HTML for printing
    printWindow.document.write('<html><head><title>Transit Records</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-bottom: 20px; 
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 8px; 
        text-align: left; 
        font-size: 12px;
      }
      th { 
        background-color: #f2f2f2; 
        font-weight: bold; 
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
      }
    `);
    printWindow.document.write('</style></head><body>');
    <h2>Transit Records</h2>
    // Add print header with filter details
    printWindow.document.write(`
      <div class="print-header">
        
        ${centerQuery ? `<p>Center: ${centerQuery}</p>` : ''}
        ${fromDate ? `<p>From Date: ${fromDate}</p>` : ''}
        ${toDate ? `<p>To Date: ${toDate}</p>` : ''}
        <p>Total Bales: ${totalBales}</p>
      </div>
    `);

    // Create table
    printWindow.document.write('<table>');
    printWindow.document.write(`
      <thead>
        <tr>
          <th>Center</th>
          <th>Date</th>
          <th>Invoice</th>
          <th>LotNo</th>
          <th>No of bales</th>
          <th>L.R No</th>
          <th>Eway-bill</th>
          <th>Vehicle No</th>
          <th>Factory</th>
          <th>TO</th>
          <th>U-D Date</th>
        </tr>
      </thead>
      <tbody>
    `);

    // Add table rows
    data.forEach(item => {
      printWindow.document.write(`
        <tr>
          <td>${item.center}</td>
          <td>${item.date}</td>
          <td>${item.invoice}</td>
          <td>${item.lotNo}</td>
          <td>${item.bales}</td>
          <td>${item.lrNo}</td>
          <td>${item.ewayNo}</td>
          <td>${item.vehicleNo}</td>
          <td>${item.factory}</td>
          <td>${item.to}</td>
          <td>${item.udNo}</td>
        </tr>
      `);
    });

    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    
    // Close the document writing
    printWindow.document.close();
    
    // Trigger print
    printWindow.print();
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
          {data.length > 0 && (
            <button 
              onClick={handlePrint} 
              className="print-btn"
              title="Print Filtered Records"
            >
              <FontAwesomeIcon icon={faPrint} /> Print
            </button>
          )}
        </div>

        <div className="bales-summary">
          <div className="total-bales">
            <span>Total Bales: {totalBales}</span>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Center</th>
                <th>Date</th>
                <th>Invoice</th>
                <th>LotNo</th>
                <th>No of bales</th>
                <th>L.R No</th>
                <th>Eway-bill</th>
                <th>Vehicle No</th>
                <th>Factory</th>
                <th>TO</th>
                <th>U-D Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.center}</td>
                  <td>{item.date}</td>
                  <td>{item.invoice}</td>
                  <td>{item.lotNo}</td>
                  <td>{item.bales}</td>
                  <td>{item.lrNo}</td>
                  <td>{item.ewayNo}</td>
                  <td>{item.vehicleNo}</td>
                  <td>{item.factory}</td>
                  <td>{item.to}</td>
                  <td>{item.udNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and logout buttons remain the same */}
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