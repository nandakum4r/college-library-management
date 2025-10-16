import React from "react";

export default function StudentDashboard() {
  return (
    <>
      <style>{`
        body {
          font-family: Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: #f4f6fa;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        /* Sidebar */
        .sidebar {
          width: 220px;
          background: #1f2937;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 30px;
          padding-left: 10px;
        }

        .sidebar h2 {
          margin-bottom: 30px;
          font-size: 20px;
          letter-spacing: 1px;
          text-align: center;
        }

        .sidebar a {
          display: block;
          width: 100%;
          padding: 12px 20px;
          text-decoration: none;
          color: white;
          font-size: 15px;
          transition: 0.3s;
        }

        .sidebar a:hover {
          background: #4b5563;
        }

        .sidebar i {
          margin-right: 8px;
        }

        /* Main Content Area */
        .main {
          flex: 1;
          display: flex;
          justify-content: center; /* center horizontally */
          align-items: center;     /* center vertically */
          background: #f4f6fa;
        }

        /* Profile Card */
        .profile-card {
          background: white;
          width: 300px;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-card img {
          width: 80px;
          height: 80px;
          margin-bottom: 15px;
        }

        .info-label {
          font-weight: bold;
          color: #1f2937;
          margin-top: 15px;
          margin-bottom: 5px;
        }

        .info-box {
          background-color: #f2f2f2;
          border-radius: 8px;
          padding: 8px 10px;
          color: #333;
          font-size: 14px;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>
            <i className="fas fa-user-graduate"></i> Student Portal
          </h2>
          <a href="#"><i className="fas fa-home"></i> Home</a>
          <a href="/borrow"><i className="fas fa-search"></i> Borrow Books</a>
          <a href="/mybooks"><i className="fas fa-book"></i> My Books</a>
          <a href="/dueDates"><i className="fas fa-calendar-alt"></i> Due Dates</a>
          <a href="#"><i className="fas fa-sign-out-alt"></i> Logout</a>
        </div>

        {/* Main Content */}
        <div className="main">
          <div className="profile-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile Icon"
            />
            <div className="info-label">Name</div>
            <div className="info-box">John Doe</div>

            <div className="info-label">Email</div>
            <div className="info-box">johndoe@example.com</div>

            <div className="info-label">Course</div>
            <div className="info-box">B.E. Computer Science</div>

            <div className="info-label">Year</div>
            <div className="info-box">3rd Year</div>
          </div>
        </div>
      </div>
    </>
  );
}
