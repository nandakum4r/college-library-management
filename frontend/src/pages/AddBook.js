import React, { useState } from "react";

function AddBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book added:", book);
    alert("Book added successfully!");
    setBook({ title: "", author: "", isbn: "" });
  };

  return (
    <>
      <style>
        {`
        .addbook-container {
          background-color: #f3f4f6;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .addbook-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .addbook-card:hover {
          transform: translateY(-5px);
        }

        .addbook-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 20px;
        }

        .addbook-input {
          display: block;
          width: 100%;
          margin-bottom: 15px;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .addbook-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .addbook-btn {
          background-color: #1e40af;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .addbook-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
        }

        .addbook-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 600px) {
          .addbook-card {
            padding: 25px;
          }

          .addbook-title {
            font-size: 1.5rem;
          }
        }
        `}
      </style>

      <div className="addbook-container">
        <div className="addbook-card">
          <h2 className="addbook-title">📚 Add New Book</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={book.title}
              onChange={handleChange}
              className="addbook-input"
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={book.author}
              onChange={handleChange}
              className="addbook-input"
              required
            />
            <input
              type="text"
              name="isbn"
              placeholder="ISBN"
              value={book.isbn}
              onChange={handleChange}
              className="addbook-input"
              required
            />
            <button type="submit" className="addbook-btn">
              Add Book
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBook;