import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentBook, setCurrentBook] = useState({
    id: null,
    title: "",
    author: "",
    publisher: "",
    publication_year: "",
    category: "",
    total_copies: 1,
  });
  const [copiesDetails, setCopiesDetails] = useState([{ isbn: "", edition: "", price: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5003/books");
      setBooks(res.data);
    } catch (err) {
      console.error("❌ Error fetching books:", err);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setCurrentBook({
      id: null,
      title: "",
      author: "",
      publisher: "",
      publication_year: "",
      category: "",
      total_copies: 1,
    });
    setCopiesDetails([{ isbn: "", edition: "", price: "" }]);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setModalType("edit");
    setCurrentBook({
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher || "",
      publication_year: book.publication_year || "",
      category: book.category || "",
      total_copies: book.total_copies || book.available_copies || 1,
    });
    setCopiesDetails([]);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook({ ...currentBook, [name]: value });

    if (name === "total_copies") {
      const count = parseInt(value) || 1;
      const updated = Array.from({ length: count }, (_, i) => copiesDetails[i] || { isbn: "", edition: "", price: "" });
      setCopiesDetails(updated);
    }
  };

  const handleCopyChange = (index, field, value) => {
    const updated = [...copiesDetails];
    updated[index][field] = value;
    setCopiesDetails(updated);
  };

  const saveBook = async () => {
    const { title, author } = currentBook;
    if (!title || !author) return alert("Title and Author are required.");

    setLoading(true);
    try {
      if (modalType === "add") {
        await axios.post("http://localhost:5003/books", {
          ...currentBook,
          copies: copiesDetails,
        });
      } else {
        await axios.put(`http://localhost:5003/books/${currentBook.id}`, currentBook);
      }
      await fetchBooks();
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error saving book:", err);
      alert("Error saving book.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5003/books/${id}`);
      await fetchBooks();
    } catch (err) {
      console.error("❌ Error deleting book:", err);
      alert("Error deleting book.");
    }
  };

  const styles = {
    container: { maxWidth: 1100, margin: "30px auto", padding: "10px" },
    addButton: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      fontWeight: "500",
      cursor: "pointer",
    },
    tableWrapper: {
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      marginTop: "20px",
      overflowX: "auto",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
    th: {
      backgroundColor: "#1f2937",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontWeight: "600",
    },
    td: { borderBottom: "1px solid #e5e7eb", padding: "10px", color: "#111827" },
    actionBtn: {
      padding: "6px 12px",
      marginRight: 8,
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 500,
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "#fff",
      padding: 24,
      borderRadius: 10,
      width: 480,
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
    },
    modalInput: {
      width: "100%",
      padding: 8,
      marginBottom: 10,
      borderRadius: 6,
      border: "1px solid #ccc",
    },
    modalBtn: {
      padding: "8px 14px",
      marginRight: 10,
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={openAddModal} style={styles.addButton}>
          + Add Book
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Author</th>
              <th style={styles.th}>Available Copies</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  No books available
                </td>
              </tr>
            ) : (
              books.map((book, index) => (
                <tr key={book.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  <td style={styles.td}>{book.id}</td>
                  <td style={styles.td}>{book.title}</td>
                  <td style={styles.td}>{book.author}</td>
                  <td style={styles.td}>{book.available_copies}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => openEditModal(book)}
                      style={{ ...styles.actionBtn, backgroundColor: "#3b82f6", color: "white" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      style={{ ...styles.actionBtn, backgroundColor: "#ef4444", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{modalType === "add" ? "Add New Book" : "Edit Book"}</h3>

            <input name="title" style={styles.modalInput} placeholder="Title" value={currentBook.title} onChange={handleChange} />
            <input name="author" style={styles.modalInput} placeholder="Author" value={currentBook.author} onChange={handleChange} />
            <input name="publisher" style={styles.modalInput} placeholder="Publisher" value={currentBook.publisher} onChange={handleChange} />
            <input name="publication_year" style={styles.modalInput} placeholder="Publication Year" type="number" value={currentBook.publication_year} onChange={handleChange} />
            <input name="category" style={styles.modalInput} placeholder="Category" value={currentBook.category} onChange={handleChange} />
            <input name="total_copies" style={styles.modalInput} placeholder="Total Copies" type="number" min="1" value={currentBook.total_copies} onChange={handleChange} />

            {modalType === "add" &&
              copiesDetails.map((copy, idx) => (
                <div key={idx} style={{ background: "#f9fafb", padding: 10, borderRadius: 6, marginBottom: 10 }}>
                  <h4>Copy {idx + 1}</h4>
                  <input placeholder="ISBN" style={styles.modalInput} value={copy.isbn} onChange={(e) => handleCopyChange(idx, "isbn", e.target.value)} />
                  <input placeholder="Edition" style={styles.modalInput} value={copy.edition} onChange={(e) => handleCopyChange(idx, "edition", e.target.value)} />
                  <input placeholder="Price" type="number" style={styles.modalInput} value={copy.price} onChange={(e) => handleCopyChange(idx, "price", e.target.value)} />
                </div>
              ))}

            <div style={{ textAlign: "right" }}>
              <button onClick={saveBook} style={{ ...styles.modalBtn, backgroundColor: "#10b981", color: "white" }} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setIsModalOpen(false)} style={{ ...styles.modalBtn, backgroundColor: "#ef4444", color: "white" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
