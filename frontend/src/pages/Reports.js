import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Filter state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5001/borrowReports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  // Filtered reports based on dropdown
  const filteredReports = reports.filter((r) =>
    statusFilter ? r.current_status === statusFilter : true
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Verdana, sans-serif",
        background: "#f4f6fa",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            background: "white",
            padding: "15px 25px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <i
              className="fas fa-chart-bar"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>{" "}
            Reports
          </div>
          <div>
            <i
              className="fas fa-user-circle"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>{" "}
            Admin
          </div>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>
            Library Reports
          </h2>

          {/* Status Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ marginRight: "10px", fontWeight: "bold" }}>
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "5px 10px", borderRadius: "4px" }}
            >
              <option value="">All</option>
              <option value="Issue Pending">Issue Pending</option>
              <option value="Issued">Issued</option>
              <option value="Past Due Date">Past Due Date</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Issued Date</th>
                <th style={thStyle}>Due Date</th>
                <th style={thStyle}>Return Date</th>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>Book Title</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((r, idx) => (
                  <tr
                    key={idx}
                    style={trStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f1f5f9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td style={tdStyle}>{r.issue_date}</td>
                    <td style={tdStyle}>{r.due_date}</td>
                    <td style={tdStyle}>{r.return_date || "-"}</td>
                    <td style={tdStyle}>{r.student_name}</td>
                    <td style={tdStyle}>{r.book_title}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: r.status_color,
                        fontWeight: "bold",
                      }}
                    >
                      {r.current_status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No reports found for the selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px 15px",
  backgroundColor: "#2563eb",
  color: "white",
  textAlign: "left",
};
const tdStyle = { padding: "12px 15px" };
const trStyle = { cursor: "pointer", transition: "background 0.3s" };

export default Reports;
