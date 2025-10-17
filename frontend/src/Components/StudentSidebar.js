import React from "react";
import { useNavigate } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .sidebar {
          width: 220px;
          background: #1f2937;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 30px;
          padding-left: 10px;
          height: 100vh;
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
      `}</style>

      <div className="sidebar">
        <h2>
          <i className="fas fa-user-graduate"></i> Student Portal
        </h2>
        <a href="#"><i className="fas fa-home"></i> Home</a>
        <a href="/borrow"><i className="fas fa-search"></i> Borrow Books</a>
        <a href="/mybooks"><i className="fas fa-book"></i> My Books</a>
        <a href="/dueDates"><i className="fas fa-calendar-alt"></i> Due Dates</a>
        {/* ✅ Keeps look, works properly */}
        <a href="#" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </>
  );
}