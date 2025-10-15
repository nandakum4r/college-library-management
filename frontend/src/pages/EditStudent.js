import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useParams } from "react-router-dom";

const EditStudent = () => {
  const { reg_no } = useParams();
  const [student, setStudent] = useState({
    name: "",
    email_id: "",
    reg_no: "",
    department: "",
    year_of_study: "",
    phone_no: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:5001/students/${reg_no}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent({
          name: data.name,
          email_id: data.email_id,
          reg_no: data.reg_no,
          department: data.department,
          year_of_study: data.year_of_study.toString(),
          phone_no: data.phone_no,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
  }, [reg_no]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudent((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/students/${reg_no}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Student updated successfully!");
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div
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
          <div>
            <i className="fas fa-user-edit" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
            Edit Student
          </div>
          <div>
            <i className="fas fa-user-circle" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
            Admin
          </div>
        </div>

        {/* Content */}
        <div
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
              <i className="fas fa-user-graduate" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
              Edit Student Details
            </h2>

            {/* Full Name */}
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              id="name"
              value={student.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* Email */}
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              id="email_id"
              value={student.email_id}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* Register Number */}
            <label style={labelStyle}>Register Number</label>
            <input
              id="reg_no"
              value={student.reg_no}
              readOnly
              style={{ ...inputStyle, background: "#e5e7eb" }}
            />

            {/* Department */}
            <label style={labelStyle}>Department</label>
            <select
              id="department"
              value={student.department}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Department</option>
              <option value="B.E. CSE">B.E. CSE</option>
              <option value="B.E. ECE">B.E. ECE</option>
              <option value="B.E. Mechanical">B.E. Mechanical</option>
              <option value="B.Tech IT">B.Tech IT</option>
            </select>

            {/* Year */}
            <label style={labelStyle}>Year</label>
            <select
              id="year_of_study"
              value={student.year_of_study}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            {/* Contact */}
            <label style={labelStyle}>Contact</label>
            <input
              id="phone_no"
              value={student.phone_no}
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
              Update Student
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

export default EditStudent;
