import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faUserTie, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div>
      {/* Inline CSS */}
      <style>{`
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: #f0f2f5;
          color: #2c2c2c;
          text-align: center;
        }
        .home-container {
          text-align: center;
        }
        .header {
          padding: 20px;
          background-color: #1f2937;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        h1 {
          margin-top: 40px;
          font-size: 32px;
          color: #2e3b4e;
        }
        p {
          color: #555;
        }
        .users {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-top: 60px;
        }
        .user-card {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0px 6px 12px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #2c2c2c;
          transition: all 0.3s ease;
        }
        .user-card:hover {
          transform: scale(1.08);
          background: #e6e9ef;
          box-shadow: 0px 8px 16px rgba(0,0,0,0.15);
        }
        .icon {
          font-size: 50px;
          margin-bottom: 15px;
          color: #1f2937;
        }
        .user-card span {
          font-size: 18px;
          font-weight: bold;
        }
        .footer {
          margin-top: 290px;
          padding: 15px;
          background-color: #1f2937;
          color: #fff;
          font-size: 14px;
        }
      `}</style>

      {/* Page Content */}
       <div className="home-container">
        <header className="header">📚 Library Management System</header>
        <h1>Welcome to the Library</h1>
        <p>Please select your role to continue:</p>

        <div className="users">
          <a href="/login" className="user-card" onClick={() => sessionStorage.setItem("role", "admin")}>
            <FontAwesomeIcon icon={faUserShield} className="icon" />
            <span>Admin</span>
          </a>
          <a href="/login" className="user-card" onClick={() => sessionStorage.setItem("role", "librarian")}>
            <FontAwesomeIcon icon={faUserTie} className="icon" />
            <span>Librarian</span>
          </a>
          <a href="/login" className="user-card" onClick={() => sessionStorage.setItem("role", "student")}>
            <FontAwesomeIcon icon={faUserGraduate} className="icon" />
            <span>Student</span>
          </a>
        </div>

        <footer className="footer">&copy; 2025 Library Management System | All Rights Reserved</footer>
      </div>
    </div>
  );
}
