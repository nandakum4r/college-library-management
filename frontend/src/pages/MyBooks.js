import React from "react";
import StudentSidebar from "../Components/StudentSidebar"; // import sidebar

export default function MyBooks() {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f5f7fa;
        }

        .dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Sidebar stays fixed width */
.sidebar {
  width: 220px;
  height: 100vh;
}

/* Main content flexes naturally */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Optional: reduce padding in content */
.content {
  flex: 1;
  padding: 10px 20px; /* reduce top/bottom space */
}


        /* Topbar */
        .topbar {
          background: white;
          padding: 15px 25px;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .topbar i {
          margin-right: 10px;
          color: #60a5fa;
        }

        /* Content area */
        .content {
          flex: 1;
          padding: 20px;
        }

        /* Profile Info */
        .profile {
          text-align: center;
          margin-bottom: 30px;
        }

        .profile img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          margin-bottom: 10px;
          border: 3px solid #1f2937;
        }

        .profile h3 {
          margin: 5px 0;
          color: #1f2937;
        }

        /* Books Table */
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

        .status-returned {
          color: green;
          font-weight: bold;
        }

        .status-issued {
          color: orange;
          font-weight: bold;
        }

        .status-overdue {
          color: red;
          font-weight: bold;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <StudentSidebar />

        {/* Main Content */}
        <div className="main">
          <div className="topbar">
            <i className="fas fa-book"></i> My Books
          </div>

          <div className="content">
            {/* Profile Info */}
            <div className="profile">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Student"
              />
              <h3>John Doe</h3>
              <p>Student ID: S12345</p>
            </div>

            {/* My Books Table */}
            <h2>My Books</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Structures in C</td>
                  <td>Reema Thareja</td>
                  <td>2025-09-20</td>
                  <td>2025-10-05</td>
                  <td className="status-issued">Issued</td>
                </tr>
                <tr>
                  <td>Operating System Concepts</td>
                  <td>Silberschatz</td>
                  <td>2025-09-01</td>
                  <td>2025-09-20</td>
                  <td className="status-overdue">Overdue</td>
                </tr>
                <tr>
                  <td>Database Management Systems</td>
                  <td>Korth</td>
                  <td>2025-08-01</td>
                  <td>2025-08-20</td>
                  <td className="status-returned">Returned</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
