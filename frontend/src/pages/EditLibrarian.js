import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useParams } from "react-router-dom";

const EditLibrarian = () => {
  const { id } = useParams(); // get librarian ID from URL
  const [librarian, setLibrarian] = useState({
    name: "",
    email_id: "",
    librarian_id: "",
    phone_no: "",
  });
    console.log("Current librarian state:", librarian);

  // Fetch librarian data on mount
  useEffect(() => {
    const fetchLibrarian = async () => {
      try {
        const res = await fetch(`http://localhost:5001/librarians/${id}`);
        if (!res.ok) throw new Error("Failed to fetch librarian");
        const data = await res.json();
        setLibrarian({
          name: data.name,
          email_id: data.email_id,
          librarian_id: data.librarian_id || data.id,
          phone_no: data.phone_no,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchLibrarian();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setLibrarian((prev) => ({ ...prev, [id]: value }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/librarians/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(librarian),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Librarian updated successfully!");
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error.");
    }
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
          <form
            onSubmit={handleSubmit}
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

            {/* Name */}
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              id="name"
              value={librarian.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* Email */}
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              id="email_id"
              value={librarian.email_id}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* Librarian ID (read-only) */}
            <label style={labelStyle}>Librarian ID</label>
            <input
              id="librarian_id"
              value={librarian.librarian_id}
              readOnly
              style={{ ...inputStyle, background: "#e5e7eb" }}
            />

            {/* Phone */}
            <label style={labelStyle}>Phone Number</label>
            <input
              id="phone_no"
              value={librarian.phone_no}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1e40af")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              Update Librarian
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles
const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
  fontSize: "14px",
  marginTop: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
  marginBottom: "10px",
};

const buttonStyle = {
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
};

export default EditLibrarian;
