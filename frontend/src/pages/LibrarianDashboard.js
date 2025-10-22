// src/pages/LibrarianDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LibrarianSidebar from "../Components/LibrarianSidebar";
import BorrowRequests from "../pages/BorrowRequests"; // Borrow Requests Component
import ReturnRequests from "../pages/ReturnRequests";
import ManageBooks from "./ManageBooks";

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  const [librarian, setLibrarian] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [books, setBooks] = useState([
  { id: 1, title: "Data Science 101", author: "John Smith", quantity: 5 },
  { id: 2, title: "Clean Code", author: "Robert Martin", quantity: 3 },
  { id: 3, title: "Python Programming", author: "Emily Davis", quantity: 4 },
]);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    if (!email || role !== "librarian") {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5001/getUser?email=${email}&role=librarian`)
      .then(res => res.json())
      .then(data => setLibrarian(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (!librarian) return <div>Loading librarian details...</div>;

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <LibrarianSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div>Librarian Dashboard</div>
          <div>{librarian.name}</div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === "home" && (
            <div style={styles.profileCard}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                alt="Profile"
                style={styles.profileImage}
              />
              <h3 style={styles.profileName}>{librarian.name}</h3>
              <p style={styles.profileRole}>Librarian</p>

              <div style={styles.infoLabel}>Email</div>
              <div style={styles.infoBox}>{librarian.email_id}</div>

              <div style={styles.infoLabel}>Librarian ID</div>
              <div style={styles.infoBox}>{librarian.id}</div>

              {librarian.phone_no && (
                <>
                  <div style={styles.infoLabel}>Phone</div>
                  <div style={styles.infoBox}>{librarian.phone_no}</div>
                </>
              )}
            </div>
          )}

          {activeTab === "borrow" && <BorrowRequests />}
          {activeTab === "return" && <ReturnRequests />}
         {activeTab === "books" && <ManageBooks books={books} setBooks={setBooks} />}
          {/* Future tabs like return, renew, manage books can be added here */}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f3f4f6",
    overflowY: "auto",
  },
  topbar: {
    background: "white",
    padding: "15px 25px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  profileCard: {
    background: "white",
    width: "320px",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: 50,
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
    fontSize: "18px",
    fontWeight: "600",
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

export default LibrarianDashboard;