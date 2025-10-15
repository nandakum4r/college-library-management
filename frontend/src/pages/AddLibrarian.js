import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";

const AddLibrarian = () => {
  const [formData, setFormData] = useState({
    librarian_id: "",
    name: "",
    email_id: "",
    phone_no: "",
    password_hash: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/addLibrarian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Librarian added successfully!");
        setFormData({
          librarian_id: "",
          name: "",
          email_id: "",
          phone_no: "",
          password_hash: "",
        });
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("Error adding librarian:", err);
      alert("❌ Server error. Check backend logs.");
    }
  };

  const styles = {
    body: {
      fontFamily: "Verdana, sans-serif",
      margin: 0,
      padding: 0,
      background: "#f4f6fa",
      display: "flex",
      height: "100vh",
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
    topbarIcon: {
      marginRight: "10px",
      color: "#60a5fa",
    },
    content: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "20px",
    },
    formContainer: {
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      width: "400px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    formTitle: {
      textAlign: "center",
      color: "#1f2937",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "5px",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    button: {
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
    },
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div style={styles.body}>
        <Sidebar />

        <div style={styles.main}>
          <div style={styles.topbar}>
            <div>
              <i className="fas fa-user-plus" style={styles.topbarIcon}></i> Add
              Librarian
            </div>
            <div>
              <i className="fas fa-user-circle" style={styles.topbarIcon}></i> Admin
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>
                <i
                  className="fas fa-user-tie"
                  style={{ color: "#2563eb", marginRight: "8px" }}
                ></i>
                Add New Librarian
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter librarian name"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email_id" style={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email_id"
                    value={formData.email_id}
                    onChange={handleChange}
                    placeholder="Enter librarian email"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="librarian_id" style={styles.label}>
                    Librarian ID
                  </label>
                  <input
                    type="text"
                    id="librarian_id"
                    value={formData.librarian_id}
                    onChange={handleChange}
                    placeholder="Enter Librarian ID"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone_no" style={styles.label}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    style={styles.input}
                  />
                </div>

                <button type="submit" style={styles.button}>
                  Add Librarian
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLibrarian;
