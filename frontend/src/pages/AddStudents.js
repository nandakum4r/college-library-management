import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    reg_no: "",
    department: "",
    year_of_study: "",
    phone_no: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ stop page refresh

    try {
      const res = await fetch("http://localhost:5001/addStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Student added successfully!");
        setFormData({
          name: "",
          email_id: "",
          reg_no: "",
          department: "",
          year_of_study: "",
          phone_no: "",
        });
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("Error adding student:", err);
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
    select: {
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
              <i className="fas fa-user-plus" style={styles.topbarIcon}></i>
              Add Student
            </div>
            <div>
              <i className="fas fa-user-circle" style={styles.topbarIcon}></i> Admin
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>
                <i
                  className="fas fa-user-graduate"
                  style={{ color: "#2563eb", marginRight: "8px" }}
                ></i>
                Add New Student
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email_id" style={styles.label}>
                    Email
                  </label>
                  <input
                    id="email_id"
                    type="email"
                    value={formData.email_id}
                    onChange={handleChange}
                    placeholder="Enter student email"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="reg_no" style={styles.label}>
                    Register Number
                  </label>
                  <input
                    id="reg_no"
                    type="text"
                    value={formData.reg_no}
                    onChange={handleChange}
                    placeholder="Enter Register Number"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="department" style={styles.label}>
                    Department
                  </label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    style={styles.select}
                  >
                    <option value="">Select Department</option>
                    <option value="B.E. CSE">B.E. CSE</option>
                    <option value="B.E. ECE">B.E. ECE</option>
                    <option value="B.E. Mechanical">B.E. Mechanical</option>
                    <option value="B.Tech IT">B.Tech IT</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="year_of_study" style={styles.label}>
                    Year
                  </label>
                <select
                    id="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                    required
                    style={styles.select}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>




                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone_no" style={styles.label}>
                    Contact Number
                  </label>
                  <input
                    id="phone_no"
                    type="text"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    required
                    style={styles.input}
                  />
                </div>

                <button type="submit" style={styles.button}>
                  Add Student
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudent;
