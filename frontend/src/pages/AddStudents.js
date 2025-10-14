import React from "react";
import Sidebar from "../Components/Sidebar"; // ✅ using your existing Sidebar

const AddStudent = () => {
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
        {/* ✅ Using Sidebar from components folder */}
        <Sidebar />

        {/* Main content area */}
        <div style={styles.main}>
          <div style={styles.topbar}>
            <div>
              <i className="fas fa-user-plus" style={styles.topbarIcon}></i> Add
              Student
            </div>
            <div>
              <i className="fas fa-user-circle" style={styles.topbarIcon}></i>{" "}
              Admin
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

              <form>
                <div style={styles.formGroup}>
                  <label htmlFor="studentName" style={styles.label}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    placeholder="Enter student name"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="studentEmail" style={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    placeholder="Enter student email"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="studentID" style={styles.label}>
                    Register Number
                  </label>
                  <input
                    type="text"
                    id="studentID"
                    placeholder="Enter Register Number"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="course" style={styles.label}>
                    Course
                  </label>
                  <select id="course" required style={styles.select}>
                    <option value="">Select Course</option>
                    <option value="B.E. CSE">B.E. CSE</option>
                    <option value="B.E. ECE">B.E. ECE</option>
                    <option value="B.E. Mechanical">B.E. Mechanical</option>
                    <option value="B.Tech IT">B.Tech IT</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="year" style={styles.label}>
                    Year
                  </label>
                  <select id="year" required style={styles.select}>
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="contact" style={styles.label}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="contact"
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
