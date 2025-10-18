import React, { useState } from "react";

function DeleteBook() {
  const [isbn, setIsbn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book deleted:", isbn);
    alert(`Book with ISBN ${isbn} deleted successfully!`);
    setIsbn("");
  };

  return (
    <>
      <style>
        {`
        .deletebook-container {
          background-color: #f3f4f6;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .deletebook-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .deletebook-card:hover {
          transform: translateY(-5px);
        }

        .deletebook-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 20px;
        }

        .deletebook-input {
          display: block;
          width: 100%;
          margin-bottom: 15px;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .deletebook-input:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .deletebook-btn {
          background-color: #dc2626;
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

        .deletebook-btn:hover {
          background-color: #b91c1c;
          transform: translateY(-2px);
        }

        .deletebook-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 600px) {
          .deletebook-card {
            padding: 25px;
          }

          .deletebook-title {
            font-size: 1.5rem;
          }
        }
        `}
      </style>

      <div className="deletebook-container">
        <div className="deletebook-card">
          <h2 className="deletebook-title">🗑️ Delete Book</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Book ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="deletebook-input"
              required
            />
            <button type="submit" className="deletebook-btn">
              Delete Book
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DeleteBook;