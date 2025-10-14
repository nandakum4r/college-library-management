import React from "react";
import Sidebar from "../Components/Sidebar"; // Use your existing Sidebar

const Reports = () => {
  const reportsData = [
    { date: "2025-10-01", student: "Ravi Kumar", book: "Introduction to Algorithms", status: "Returned" },
    { date: "2025-10-02", student: "Priya Sharma", book: "Database Systems", status: "Issued" },
    { date: "2025-10-03", student: "Anil Raj", book: "Operating Systems", status: "Returned" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Verdana, sans-serif", background: "#f4f6fa" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "15px 25px",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div><i className="fas fa-chart-bar" style={{ marginRight: "10px", color: "#60a5fa" }}></i> Reports</div>
          <div><i className="fas fa-user-circle" style={{ marginRight: "10px", color: "#60a5fa" }}></i> Admin</div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>Library Reports</h2>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr>
                <th style={{ padding: "12px 15px", backgroundColor: "#2563eb", color: "white", textAlign: "left" }}>Date</th>
                <th style={{ padding: "12px 15px", backgroundColor: "#2563eb", color: "white", textAlign: "left" }}>Student Name</th>
                <th style={{ padding: "12px 15px", backgroundColor: "#2563eb", color: "white", textAlign: "left" }}>Book Title</th>
                <th style={{ padding: "12px 15px", backgroundColor: "#2563eb", color: "white", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((report, index) => (
                <tr key={index} style={{ cursor: "pointer", transition: "background 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}>
                  <td style={{ padding: "12px 15px" }}>{report.date}</td>
                  <td style={{ padding: "12px 15px" }}>{report.student}</td>
                  <td style={{ padding: "12px 15px" }}>{report.book}</td>
                  <td style={{ padding: "12px 15px" }}>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
