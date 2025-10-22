import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BorrowedBooks = () => {
  const navigate = useNavigate();

  const [borrowedBooks] = useState([
    { id: 1, student: "David Lee", book: "Machine Learning Basics", borrowedOn: "2025-10-10", dueDate: "2025-10-25" },
    { id: 2, student: "Alice Johnson", book: "Data Science 101", borrowedOn: "2025-10-12", dueDate: "2025-10-27" },
    { id: 3, student: "Emily Davis", book: "Python Programming", borrowedOn: "2025-10-15", dueDate: "2025-10-30" },
  ]);

  const styles = {
    headerBar: {
      backgroundColor: "#1e3a8a",
      color: "white",
      padding: "15px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    },
    headerTitle: { fontSize: "22px", fontWeight: 600, letterSpacing: "0.5px" },
    container: {
      padding: "40px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
    },
    tableContainer: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "20px",
      maxWidth: 1100,
      margin: "40px auto 0 auto",
      overflowX: "auto",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
    th: {
      backgroundColor: "#1f2937",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontWeight: "600",
    },
    td: { borderBottom: "1px solid #e5e7eb", padding: "10px", color: "#111827" },
    backBtn: {
      padding: "8px 14px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: "#3b82f6",
      color: "white",
      fontWeight: 500,
    },
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={styles.headerBar}>
        <div style={styles.headerTitle}>📚 Borrowed Books</div>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* Content */}
      <div style={styles.container}>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Book Title</th>
                <th style={styles.th}>Borrowed On</th>
                <th style={styles.th}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((b) => (
                <tr key={b.id}>
                  <td style={styles.td}>{b.id}</td>
                  <td style={styles.td}>{b.student}</td>
                  <td style={styles.td}>{b.book}</td>
                  <td style={styles.td}>{b.borrowedOn}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: new Date(b.dueDate) < new Date() ? "#ef4444" : "#111827",
                      fontWeight: 600,
                    }}
                  >
                    {b.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;
