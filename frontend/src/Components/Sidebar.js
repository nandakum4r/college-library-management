import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const styles = {
    sidebar: {
      width: "220px",
      background: "#1f2937",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "30px",
      height: "100vh",
    },
    sidebarTitle: {
      marginBottom: "30px",
      fontSize: "20px",
      letterSpacing: "1px",
      textAlign: "center",
    },
    sidebarLink: {
      display: "block",
      width: "100%",
      padding: "12px 20px",
      textDecoration: "none",
      color: "white",
      fontSize: "15px",
      transition: "0.3s",
    },
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>
          <i className="fas fa-user-shield"></i> Admin Panel
        </h2>
        <Link to="/" style={styles.sidebarLink}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        <Link to="/students" style={styles.sidebarLink}>
          <i className="fas fa-users"></i> Manage Students
        </Link>
        <a href="/Librarians" style={styles.sidebarLink}>
          <i className="fas fa-user-tie"></i> Manage Librarians
        </a>
        <a href="/Reports" style={styles.sidebarLink}>
          <i className="fas fa-chart-bar"></i> Reports
        </a>
        <a href="#" style={styles.sidebarLink}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </>
  );
};

export default Sidebar;
