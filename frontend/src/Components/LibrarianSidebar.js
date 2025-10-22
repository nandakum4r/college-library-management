// src/Components/LibrarianSidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";

const LibrarianSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const sidebarLinkStyle = (isActive) => ({
    width: "100%",
    padding: "12px 25px",
    textDecoration: "none",
    color: "white",
    backgroundColor: isActive ? "#374151" : "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "0.3s",
  });

  const iconStyle = { marginRight: 10, width: 20, textAlign: "center" };

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#1f2937",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        boxSizing: "border-box",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Librarian Portal
      </div>

      {/* Links */}
      <div>
        <div onClick={() => setActiveTab("home")} style={sidebarLinkStyle(activeTab === "home")}>
          <i className="fas fa-home" style={iconStyle}></i> Home
        </div>

        <div onClick={() => setActiveTab("borrow")} style={sidebarLinkStyle(activeTab === "borrow")}>
          <i className="fas fa-book" style={iconStyle}></i> Borrow Requests
        </div>

        <div onClick={() => setActiveTab("return")} style={sidebarLinkStyle(activeTab === "return")}>
          <i className="fas fa-undo" style={iconStyle}></i> Return Requests
        </div>

        <div onClick={() => setActiveTab("books")} style={sidebarLinkStyle(activeTab === "books")}>
          <i className="fas fa-book-open" style={iconStyle}></i> Manage Books
        </div>
      </div>

      {/* Logout directly below links */}
      <div
        onClick={handleLogout}
        style={{
          ...sidebarLinkStyle(false),
        }}
      >
        <i className="fas fa-sign-out-alt" style={iconStyle}></i> Logout
      </div>
    </div>
  );
};

export default LibrarianSidebar;