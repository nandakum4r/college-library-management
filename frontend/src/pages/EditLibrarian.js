import React, { useState } from "react";
import Sidebar from "../Components/Sidebar"; // your existing Sidebar

const EditLibrarian = () => {
  const [librarian, setLibrarian] = useState({
    name: "Anita Sharma",
    email: "anita@example.com",
    librarianID: "L001",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLibrarian((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated librarian:", librarian);
    // Add API call or state update logic here
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Verdana, sans-serif", background: "#f4f6fa" }}>
      <Sidebar />

      <div className="main" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div
          className="topbar"
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
          <div><i className="fas fa-user-edit" style={{ marginRight: "10px", color: "#60a5fa" }}></i> Edit Librarian</div>
          <div><i className="fas fa-user-circle" style={{ marginRight: "10px", color: "#60a5fa" }}></i> Admin</div>
        </div>

        {/* Content */}
        <div
          className="content"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div
            className="form-container"
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#1f2937", marginBottom: "20px" }}>
              <i className="fas fa-user-tie" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
              Edit Librarian Details
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="name" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={librarian.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="email" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={librarian.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Librarian ID (read-only) */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="librarianID" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Librarian ID
                </label>
                <input
                  type="text"
                  id="librarianID"
                  value={librarian.librarianID}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                    background: "#e5e7eb",
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="phone" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={librarian.phone}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1e40af")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
              >
                Update Librarian
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLibrarian;
