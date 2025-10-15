import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";

const ManageLibrarians = () => {
  const navigate = useNavigate();

  // ✅ State to store fetched librarians
  const [librarianData, setLibrarianData] = useState([]);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const res = await fetch("http://localhost:5001/librarians");
        if (!res.ok) throw new Error("Failed to fetch librarians");
        const data = await res.json();
        setLibrarianData(data);
      } catch (err) {
        console.error("Error fetching librarians:", err);
      }
    };

    fetchLibrarians();
  }, []);

  // ✅ Navigate to EditLibrarian page with id
  const handleEdit = (id) => {
    navigate(`/edit-librarian/${id}`);
  };

  // ✅ Delete librarian with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this librarian record?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5001/librarians/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Librarian deleted successfully!");
        setLibrarianData((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error.");
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div style={styles.dashboardContainer}>
        <Sidebar />

        <div style={styles.main}>
          {/* Topbar */}
          <div style={styles.topbar}>
            <div>
              <i
                className="fas fa-user-tie"
                style={{ marginRight: "10px", color: "#60a5fa" }}
              ></i>
              Manage Librarians
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
            <h2 style={styles.heading}>Librarian Records</h2>

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
                onClick={() => navigate("/add-librarian")}
              >
                <i className="fas fa-plus"></i> Add Librarian
              </button>
            </div>

            {/* Librarian Table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Librarian ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {librarianData.length > 0 ? (
                  librarianData.map((librarian) => (
                    <tr key={librarian.id} style={styles.tr}>
                      <td style={styles.td}>{librarian.id}</td>
                      <td style={styles.td}>{librarian.name}</td>
                      <td style={styles.td}>{librarian.email_id}</td>
                      <td style={styles.td}>{librarian.phone_no}</td>
                      <td style={{ ...styles.td, ...styles.actionsBtn }}>
                        <button
                          style={{ ...styles.iconBtn, color: "#2563eb" }}
                          onClick={() => handleEdit(librarian.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          style={{ ...styles.iconBtn, color: "#dc2626" }}
                          onClick={() => handleDelete(librarian.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.td}>
                      No librarian records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ Reuse styles from ManageStudents
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

export default ManageLibrarians;
