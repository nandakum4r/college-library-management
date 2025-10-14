import React from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom"
const ManageStudents = () => {
     const navigate = useNavigate();
     const handleEdit = () => {
    navigate("/EditStudent"); // navigate to EditStudent page
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div style={styles.dashboardContainer}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div style={styles.main}>
          {/* Topbar */}
          <div style={styles.topbar}>
            <div>
              <i
                className="fas fa-users"
                style={{ marginRight: "10px", color: "#60a5fa" }}
              ></i>
              Manage Students
            </div>
            <div>
              <i
                className="fas fa-user-circle"
                style={{ marginRight: "10px", color: "#60a5fa" }}
              ></i>
              Admin
            </div>
          </div>

          {/* Content */}
          <div style={styles.content}>
            <h2 style={styles.heading}>Student Records</h2>

            {/* Search & Add Button */}
            <div style={styles.actions}>
              <div style={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  style={styles.searchInput}
                />
              </div>
              <button
      style={{ ...styles.btn, ...styles.btnAdd }}
      onClick={() => navigate("/AddStudents")}
    >
      <i className="fas fa-plus"></i> Add Student
    </button>
            </div>

            {/* Student Table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={styles.td}>{student.id}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.course}</td>
                    <td style={styles.td}>{student.year}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={{ ...styles.td, ...styles.actionsBtn }}>
                       <button
      style={{ ...styles.iconBtn, color: "#2563eb" }}
      onClick={handleEdit}
    >
      <i className="fas fa-edit"></i>
    </button>
                      <button style={{ ...styles.iconBtn, color: "#dc2626" }}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ Dummy data (you can replace it with API data later)
const studentData = [
  { id: "S001", name: "John Doe", course: "B.E. CSE", year: "3rd", email: "john@example.com" },
  { id: "S002", name: "Mary Smith", course: "B.Tech IT", year: "2nd", email: "mary@example.com" },
  { id: "S003", name: "Rahul Kumar", course: "B.E. ECE", year: "4th", email: "rahul@example.com" },
];

// ✅ Inline styles (same as your HTML)
const styles = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "Verdana, sans-serif",
    background: "#f4f6fa",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f4f6fa",
  },

  topbar: {
    background: "white",
    color: "black",
    padding: "15px 25px",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },

  content: {
    flex: 1,
    padding: "30px",
  },

  heading: {
    marginBottom: "20px",
    color: "#1f2937",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  searchBar: {
    flex: 1,
  },

  searchInput: {
    padding: "8px 12px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },

  btn: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },

  btnAdd: {
    background: "#2563eb",
    color: "white",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },

  th: {
    padding: "12px 15px",
    textAlign: "center",
    background: "#1f2937",
    color: "white",
    fontSize: "14px",
  },

  td: {
    padding: "12px 15px",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },

  tr: {
    transition: "0.2s",
  },

  actionsBtn: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },

  iconBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.2s",
  },
};

export default ManageStudents;
