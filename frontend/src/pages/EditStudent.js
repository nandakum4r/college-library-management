import React, { useState } from "react";
import Sidebar from "../Components/Sidebar"; // import your existing Sidebar

const EditStudent = () => {
  const [student, setStudent] = useState({
    name: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    registerNumber: "S1024",
    course: "B.E. CSE",
    year: "2nd Year",
    contact: "9876543210",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudent((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated student:", student);
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
          <div><i className="fas fa-user-edit" style={{ marginRight: "10px", color: "#60a5fa" }}></i> Edit Student</div>
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
              <i className="fas fa-user-graduate" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
              Edit Student Details
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="name" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={student.name}
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
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="email" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={student.email}
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

              {/* Register Number */}
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="registerNumber" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Register Number
                </label>
                <input
                  type="text"
                  id="registerNumber"
                  value={student.registerNumber}
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

              {/* Course */}
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="course" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Course
                </label>
                <select
                  id="course"
                  value={student.course}
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
                >
                  <option value="">Select Course</option>
                  <option value="B.E. CSE">B.E. CSE</option>
                  <option value="B.E. ECE">B.E. ECE</option>
                  <option value="B.E. Mechanical">B.E. Mechanical</option>
                  <option value="B.Tech IT">B.Tech IT</option>
                </select>
              </div>

              {/* Year */}
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="year" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Year
                </label>
                <select
                  id="year"
                  value={student.year}
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
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* Contact */}
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="contact" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  value={student.contact}
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
                Update Student
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
