import React from "react";
import Sidebar from "../Components/Sidebar.js";

const Dashboard = () => {
  return (
    <div style={styles.dashboardContainer}>
      <Sidebar />

      <div style={styles.main}>
        {/* ✅ Topbar (kept here as you requested) */}
        <div style={styles.topbar}>
          <div>
            <i
              className="fas fa-tachometer-alt"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>
            Admin Dashboard
          </div>
          <div>
            <i
              className="fas fa-user-circle"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>
            Admin
          </div>
        </div>

        {/* ✅ Main content */}
        <div style={styles.content}>
          <div style={styles.profileCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
              alt="Admin Profile"
              style={styles.profileImage}
            />
            <h3 style={styles.profileName}>John Smith</h3>
            <p style={styles.profileRole}>Administrator</p>

            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoBox}>admin@librarysystem.com</div>

            <div style={styles.infoLabel}>Role</div>
            <div style={styles.infoBox}>System Administrator</div>

            <div style={styles.infoLabel}>Contact</div>
            <div style={styles.infoBox}>+91 9876543210</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "Verdana, sans-serif",
    margin: 0,
    padding: 0,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
  },
  profileCard: {
    background: "white",
    width: "320px",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  profileImage: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "3px solid #2563eb",
  },
  profileName: {
    color: "#1f2937",
    marginBottom: "8px",
  },
  profileRole: {
    margin: "5px 0",
    color: "#4b5563",
    fontSize: "14px",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: "15px",
    marginBottom: "5px",
  },
  infoBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: "8px",
    padding: "8px 10px",
    color: "#333",
    fontSize: "14px",
  },
};

export default Dashboard;
