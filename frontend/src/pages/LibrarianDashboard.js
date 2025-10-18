import React from "react";
import { useNavigate } from "react-router-dom";
import { BookPlus, UserPlus, BookX } from "lucide-react";

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      backgroundColor: "#E8EBEE",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      backgroundColor: "#1F2937", // dark navy
      color: "white",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    logo: {
      width: "30px",
      height: "30px",
    },
    main: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
    },
    heading: {
      fontSize: "1.8rem",
      color: "#1F2937",
      fontWeight: "700",
      marginBottom: "0.5rem",
    },
    subtext: {
      color: "#4B5563",
      marginBottom: "2rem",
    },
    actions: {
      display: "flex",
      gap: "2.5rem",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "50%",
      width: "160px",
      height: "160px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
    },
    icon: {
      width: "40px",
      height: "40px",
      color: "#1F2937",
      marginBottom: "10px",
    },
    label: {
      fontWeight: "600",
      color: "#1F2937",
    },
    footer: {
      backgroundColor: "#1F2937",
      color: "white",
      textAlign: "center",
      padding: "1rem",
      fontSize: "0.9rem",
    },
    logoutButton: {
      backgroundColor: "#E11D48",
      border: "none",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.title}>
          <img
            src="https://img.icons8.com/color/48/library.png"
            alt="Library Logo"
            style={styles.logo}
          />
          <span>Library Management System</span>
        </div>
        <button style={styles.logoutButton} onClick={() => navigate("/")}>
          Logout
        </button>
      </header>

      {/* Main Section */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Welcome to the Librarian Dashboard</h2>
        <p style={styles.subtext}>Please select an action to continue:</p>

        <div style={styles.actions}>
          {/* Add Book */}
          <div
            style={styles.card}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.card)
            }
            onClick={() => navigate("/addbook")}
          >
            <BookPlus style={styles.icon} />
            <span style={styles.label}>Add Book</span>
          </div>

          {/* Delete Book */}
          <div
            style={styles.card}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.card)
            }
            onClick={() => navigate("/deletebook")}
          >
            <BookX style={styles.icon} />
            <span style={styles.label}>Delete Book</span>
          </div>

          {/* Add Student */}
          <div
            style={styles.card}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.card)
            }
            onClick={() => navigate("/addstudents")}
          >
            <UserPlus style={styles.icon} />
            <span style={styles.label}>Add Student</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2025 Library Management System | All Rights Reserved
      </footer>
    </div>
  );
};

export default LibrarianDashboard;