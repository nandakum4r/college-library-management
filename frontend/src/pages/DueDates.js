import React from "react";
import StudentSidebar from "../Components/StudentSidebar";

export default function DueDates() {
  return (
    <>
      <style>{`
    
        .app-container {
          margin: 0;
         
          font-family: Arial, sans-serif;
          display: flex;
          background: #f5f7fa;
          min-height: 100vh;
        }

        /* Main content */
        .main {
          margin-left: 220px; /* Match sidebar width */
          flex: 1;
          padding: 0; /* remove padding */
        }
          

        /* Topbar */
        .topbar {
          height: 60px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          border-radius: 0; /* remove extra rounding */
          margin: 0; /* remove margin */
        }

        /* Profile Info */
        .profile {
          text-align: center;
          margin: 0; /* remove vertical space */
          padding: 10px 0; /* optional padding */
        }

        .profile img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-bottom: 5px;
          border: 3px solid #1f2937;
        }

        .profile h3 {
          margin: 0;
          color: #1f2937;
        }

        .profile p {
          margin: 0;
          font-size: 14px;
          color: #4b5563;
        }

        /* Table */
        h2 {
          margin: 10px 0; /* reduce spacing above table */
          padding-left: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #1f2937;
          color: white;
        }

        tr:hover {
          background: #f1f5f9;
        }

        .status-due {
          color: orange;
          font-weight: bold;
        }

        .status-overdue {
          color: red;
          font-weight: bold;
        }

        /* Action buttons */
        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 6px;
        }

        .btn-renew {
          background: #38bdf8;
          color: white;
        }

        .btn-return {
          background: #22c55e;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="app-container">
        <StudentSidebar />

        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <h2>Dashboard</h2>
            <div>Welcome, John Doe</div>
          </div>

          {/* Profile Info */}
          <div className="profile">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Student"
            />
            <h3>John Doe</h3>
            <p>Student ID: S12345</p>
          </div>

          {/* Due Dates Table */}
          <h2>📅 Books Due / Overdue</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Computer Networks</td>
                <td>Andrew Tanenbaum</td>
                <td>2025-10-12</td>
                <td className="status-due">Due Soon</td>
                <td>
                  <button className="btn btn-renew">
                    <i className="fas fa-sync"></i> Renew
                  </button>
                  <button className="btn btn-return">
                    <i className="fas fa-undo"></i> Return
                  </button>
                </td>
              </tr>
              <tr>
                <td>Java Programming</td>
                <td>Herbert Schildt</td>
                <td>2025-10-05</td>
                <td className="status-overdue">Overdue</td>
                <td>
                  <button className="btn btn-return">
                    <i className="fas fa-undo"></i> Return
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
