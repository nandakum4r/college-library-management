import React, { useEffect, useState } from "react";
import StudentSidebar from "../Components/StudentSidebar.js"; // Sidebar component

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const email = sessionStorage.getItem("email"); // get logged-in student's email
    if (!email) return;

    // Fetch student data from backend
    fetch(`http://localhost:5001/student/${email}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.error("Error fetching student data:", err));
  }, []);

  if (!student) {
    return <div>Loading student details...</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <StudentSidebar />

      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div>
            <i
              className="fas fa-tachometer-alt"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>
            Student Dashboard
          </div>
          <div>
            <i
              className="fas fa-user-circle"
              style={{ marginRight: "10px", color: "#60a5fa" }}
            ></i>
            {student.name}
          </div>
        </div>

        {/* Main content */}
        <div style={styles.content}>
          <div style={styles.profileCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
              alt="Student Profile"
              style={styles.profileImage}
            />
            <h3 style={styles.profileName}>{student.name}</h3>
            <p style={styles.profileRole}>{student.department} Student</p>

            <div style={styles.infoLabel}>Registration No</div>
            <div style={styles.infoBox}>{student.reg_no}</div>

            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoBox}>{student.email_id}</div>

            <div style={styles.infoLabel}>Course</div>
            <div style={styles.infoBox}>{student.course}</div>

            <div style={styles.infoLabel}>Year</div>
            <div style={styles.infoBox}>{student.year_of_study}</div>

            <div style={styles.infoLabel}>Phone</div>
            <div style={styles.infoBox}>{student.phone_no}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "Verdana, sans-serif",
    margin: 0,
    padding: 0,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
  },
  profileCard: {
    background: "white",
    width: "320px",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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

export default StudentDashboard;