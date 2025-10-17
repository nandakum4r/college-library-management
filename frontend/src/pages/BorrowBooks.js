import React, { useState, useEffect } from "react";
import StudentSidebar from "../Components/StudentSidebar";

export default function BorrowBooks() {
  const [books, setBooks] = useState([]);

  // Fetch books from backend
  const fetchBooks = () => {
    fetch("http://localhost:5002/books")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.book_id.localeCompare(b.book_id));
        setBooks(sorted);
      })
      .catch((err) => console.error("Error fetching books:", err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Borrow button click handler
  const handleBorrow = async (book_id) => {
    const email_id = sessionStorage.getItem("email"); // use actual logged-in info
    if (!email_id) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id, book_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(
        `Borrow request successful!\nToken: ${data.token}`
      );

      fetchBooks(); // refresh book list
    } catch (err) {
      console.error(err);
      alert("Error processing borrow request");
    }
  };

  return (
    <>
      <style>{`
        body { 
        font-family: Verdana,sans-serif; 
        margin:0; 
        padding:0; 
        background:#f4f6fa; 
        }

        .dashboard-container { 
        display:flex; 
        height:100vh; 
        width:100%; 
        }
        
        .main { 
        flex:1; 
        display:flex; 
        flex-direction:column; 
        background:#f4f6fa; 
        }

        .topbar { 
        background:white; 
        color:black; 
        padding:15px 25px; 
        font-size:20px; 
        font-weight:bold; 
        display:flex; 
        align-items:center; 
        box-shadow:0 2px 6px rgba(0,0,0,0.1); 
        }

        .topbar i { 
        margin-right:10px; 
        color:#60a5fa; 
        }

        .content { 
        flex:1; 
        display:flex; 
        justify-content:center; 
        align-items:center; 
        }

        .book-section { 
        width:800px; 
        background:white; 
        padding:30px; 
        border-radius:12px; 
        box-shadow:0 4px 10px rgba(0,0,0,0.1); 
        text-align:center; 
        }

        .book-section h3 { 
        margin-top:0; 
        color:#1f2937; 
        }

        table { 
        width:100%; 
        border-collapse:collapse; 
        margin-top:15px; 
        }

        th, td { 
        border:1px solid #ddd; 
        padding:10px; 
        text-align:center; 
        }

        th { 
        background:#1f2937; 
        color:white; 
        }

        tr:nth-child(even) { 
        background:#f9fafb; 
        }

        .borrow-btn { 
        background:#059669; 
        color:white; 
        border:none; 
        padding:6px 12px; 
        border-radius:6px; 
        cursor:pointer; 
        transition:0.3s; 
        }

        .borrow-btn:hover { 
        background:#047857; 
        }

        .borrow-btn:disabled { 
        background:gray; 
        cursor:not-allowed; 
        }
      `}</style>

      <div className="dashboard-container">
        <StudentSidebar />
        <div className="main">
          <div className="topbar">
            <i className="fas fa-book-open"></i> Borrow Books
          </div>

          <div className="content">
            <div className="book-section">
              <h3>Available Books</h3>
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
                  {books.length === 0 ? (
                    <tr><td colSpan="5">Loading books...</td></tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.book_id}>
                        <td>{book.book_id}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.available_copies > 0 ? "Available" : "Not Available"}</td>
                        <td>
                          <button
                            className="borrow-btn"
                            disabled={book.available_copies === 0}
                            onClick={() => handleBorrow(book.book_id)}
                          >
                            {book.available_copies > 0 ? "Borrow" : "Unavailable"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}