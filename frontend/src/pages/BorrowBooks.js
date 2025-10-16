import React from "react";
import StudentSidebar from "../Components/StudentSidebar"; // import your existing sidebar

export default function BorrowBooks() {
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

        /* Main Layout */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f4f6fa;
        }

        /* Topbar */
        .topbar {
          background: white;
          color: black;
          padding: 15px 25px;
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .topbar i {
          margin-right: 10px;
          color: #60a5fa;
        }

        /* Content area */
        .content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .book-section {
          width: 800px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .book-section h3 {
          margin-top: 0;
          color: #1f2937;
        }

        .book-search {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .book-search input {
          width: 60%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px 0 0 8px;
          outline: none;
          font-size: 14px;
        }

        .book-search button {
          padding: 10px 20px;
          border: none;
          background: #2563eb;
          color: white;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-size: 14px;
          transition: 0.3s;
        }

        .book-search button:hover {
          background: #1e40af;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }

        th {
          background: #1f2937;
          color: white;
        }

        tr:nth-child(even) {
          background: #f9fafb;
        }

        .borrow-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .borrow-btn:hover {
          background: #047857;
        }

        .borrow-btn:disabled {
          background: gray;
          cursor: not-allowed;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Use StudentSidebar component */}
        <StudentSidebar />

        {/* Main Content */}
        <div className="main">
          <div className="topbar">
            <i className="fas fa-book-open"></i> Borrow Books
          </div>

          <div className="content">
            <div className="book-section">
              <h3>Available Books</h3>

              <div className="book-search">
                <input type="text" placeholder="Search by title, author, or ID..." />
                <button><i className="fas fa-search"></i> Search</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Book ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>B001</td>
                    <td>Introduction to Algorithms</td>
                    <td>Thomas H. Cormen</td>
                    <td>Available</td>
                    <td><button className="borrow-btn">Borrow</button></td>
                  </tr>
                  <tr>
                    <td>B002</td>
                    <td>Clean Code</td>
                    <td>Robert C. Martin</td>
                    <td>Available</td>
                    <td><button className="borrow-btn">Borrow</button></td>
                  </tr>
                  <tr>
                    <td>B003</td>
                    <td>Python Crash Course</td>
                    <td>Eric Matthes</td>
                    <td>Not Available</td>
                    <td><button className="borrow-btn" disabled>Unavailable</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
