import React, { useEffect, useState } from "react";
import StudentSidebar from "../Components/StudentSidebar";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) {
      alert("Please login first!");
      return;
    }

    // Fetch student info
    fetch(`http://localhost:5001/student/${email}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.error("Error fetching student data:", err));

    // Fetch borrowed books (includes fine data)
    fetch(`http://localhost:5002/mybooks/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch borrowed books");
        return res.json();
      })
      .then((data) => {
        setBooks(data.books);
        setTotalFine(data.totalFine);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching borrowed books:", err);
        setLoading(false);
      });
  }, []);

  // Map status to CSS class
  const getStatusClass = (status, due_date) => {
    if (status === "RETURNED") return "status-returned";
    if(status ==="RETURN_PENDING") return "status-return-pending";
    if (status === "EXPIRED") return "status-expired";
    if (status === "ISSUE_PENDING") return "status-issued"; // orange for pending
    if (status === "ISSUED") {
      const today = new Date();
      const due = new Date(due_date);
      return today > due ? "status-overdue" : "status-issued";
    }
    return "";
  };

  // Display text for status
  const getStatusText = (book) => {
    if (book.status === "RETURNED") return "Returned";
    if (book.status === "EXPIRED") return "Expired";
    if (book.status === "RETURN_PENDING") return "Return Pending"
    if (book.status === "ISSUE_PENDING") return "Issue Pending"; // show text explicitly
    if (book.status === "ISSUED") {
      const today = new Date();
      const due = new Date(book.due_date);
      return today > due ? "Overdue" : "Issued";
    }
    return book.status;
  };

  if (!student) return <div>Loading student details...</div>;
  if (loading) return <div>Loading borrowed books...</div>;

  return (
    <>
      <style>{`
        body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fa; }
        .dashboard-container { display: flex; height: 100vh; width: 100%; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .content { flex: 1; padding: 20px; }
        .topbar { background: white; padding: 15px 25px; font-size: 20px; font-weight: bold; display: flex; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .topbar i { margin-right: 10px; color: #60a5fa; }
        .profile { text-align: center; margin-bottom: 30px; }
        .profile img { width: 90px; height: 90px; border-radius: 50%; margin-bottom: 10px; border: 3px solid #1f2937; }
        .profile h3 { margin: 5px 0; color: #1f2937; }
        .profile p { color: #4b5563; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #1f2937; color: white; }
        tr:hover { background: #f1f5f9; }
        .status-return-pending { 
  color: green; 
  font-weight: bold; 
}
        .status-returned { color: green; font-weight: bold; }
        .status-issued { color: orange; font-weight: bold; } /* used for ISSUE_PENDING or normal issued */
        .status-overdue { color: red; font-weight: bold; }
        .status-expired { color: #a21caf; font-weight: bold; }
        .fine-total { text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold; color: #1f2937; }
      `}</style>

      <div className="dashboard-container">
        <StudentSidebar />
        <div className="main">
          <div className="topbar">
            <i className="fas fa-book"></i> My Books
          </div>

          <div className="content">
            <div className="profile">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Student"
              />
              <h3>{student.name}</h3>
              <p>Student ID: {student.reg_no}</p>
            </div>

            <h2>My Books</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine (₹)</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6">No books borrowed yet</td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.borrow_id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{new Date(book.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(book.due_date).toLocaleDateString()}</td>
                      <td className={getStatusClass(book.status, book.due_date)}>
                        {getStatusText(book)}
                      </td>
                      <td>{book.fine === 0 ? "-" : book.fine}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="fine-total">Total Fine: ₹{totalFine}</div>
          </div>
        </div>
      </div>
    </>
  );
}