import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LibrarianDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const librarian = {
    name: "Anitha R",
    id: "LIB2025001",
  };

  const [requests, setRequests] = useState({
    return: [
      { id: 3, student: "Alice Johnson", book: "Data Science 101", date: "2025-10-20", status: "Pending", fine: "₹2" },
      { id: 4, student: "Robert Martin", book: "Clean Code", date: "2025-10-18", status: "Approved", fine: "-" },
    ],
    borrow: [
      { id: 1, student: "David Lee", book: "Machine Learning Basics", date: "2025-10-19", status: "Pending", fine: "-" },
    ],
    renew: [
      { id: 2, student: "Emily Davis", book: "Python Programming", date: "2025-10-15", status: "Pending", fine: "₹1" },
    ],
  });

  const [books, setBooks] = useState([
    { id: 1, title: "Data Science 101", author: "John Smith", quantity: 5 },
    { id: 2, title: "Clean Code", author: "Robert Martin", quantity: 3 },
    { id: 3, title: "Python Programming", author: "Emily Davis", quantity: 4 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentBook, setCurrentBook] = useState({ id: null, title: "", author: "", quantity: 0 });

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    sessionStorage.setItem("role", "librarian");
    navigate("/login");
  };

  const handleHome = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    sessionStorage.setItem("role", "librarian");
    navigate("/");
  };

  const handleAction = (type, id, action) => {
    setRequests((prev) => {
      const updated = prev[type].map((r) => {
        if (r.id !== id) return r;
        if (r.status !== "Pending") return r;
        return {
          ...r,
          status: action === "approve" ? "Approved" : "Rejected",
        };
      });
      return { ...prev, [type]: updated };
    });
  };

  const openAddModal = () => {
    setModalType("add");
    setCurrentBook({ id: null, title: "", author: "", quantity: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setModalType("edit");
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const saveBook = () => {
    if (!currentBook.title || !currentBook.author || currentBook.quantity < 0) {
      alert("Please enter valid book details.");
      return;
    }

    if (modalType === "add") {
      setBooks((prev) => [...prev, { ...currentBook, id: prev.length + 1 }]);
    } else if (modalType === "edit") {
      setBooks((prev) => prev.map((b) => (b.id === currentBook.id ? currentBook : b)));
    }

    setIsModalOpen(false);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    sidebar: {
      width: "220px",
      backgroundColor: "#1f2937",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "30px 0",
      alignItems: "center",
    },
    sidebarTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "20px" },
    sidebarLink: (isActive) => ({
      width: "100%",
      padding: "12px 25px",
      textDecoration: "none",
      color: "white",
      backgroundColor: isActive ? "#374151" : "transparent",
      transition: "0.3s",
      cursor: "pointer",
    }),
    main: { flex: 1, padding: "30px 50px", backgroundColor: "#f3f4f6", overflowY: "auto" },

    // New clean profile style (matches screenshot)
    profile: {
      textAlign: "center",
      marginTop: "40px",
      marginBottom: "50px",
    },
    profileImg: {
      width: "110px",
      height: "110px",
      borderRadius: "50%",
      backgroundColor: "#e5e7eb",
      objectFit: "cover",
      display: "block",
      margin: "0 auto 10px",
    },
    profileName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "4px",
    },
    profileId: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },

    tableContainer: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "20px",
      maxWidth: 1100,
      margin: "20px auto",
      overflowX: "auto",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
    th: { backgroundColor: "#1f2937", color: "white", padding: "12px", textAlign: "left", fontWeight: "600" },
    td: { borderBottom: "1px solid #e5e7eb", padding: "10px", color: "#111827" },
    actionBtn: {
      padding: "6px 12px",
      marginRight: "8px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
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
      padding: 20,
      borderRadius: 8,
      width: 400,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    modalInput: { width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" },
    modalBtn: { padding: "8px 14px", marginRight: 10, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  };

  const renderTable = (data, type) => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            {type === "books" ? (
              <>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Actions</th>
              </>
            ) : (
              <>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Book Title</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Fine (₹)</th>
                <th style={styles.th}>Action</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {type === "books" ? (
                <>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{item.author}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{ ...styles.actionBtn, backgroundColor: "#3b82f6", color: "white" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(item.id)}
                      style={{ ...styles.actionBtn, backgroundColor: "#ef4444", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.student}</td>
                  <td style={styles.td}>{item.book}</td>
                  <td style={styles.td}>{item.date}</td>
                  <td style={{ ...styles.td, color: item.status === "Pending" ? "#D97706" : "#16A34A", fontWeight: 600 }}>
                    {item.status}
                  </td>
                  <td style={styles.td}>{item.fine}</td>
                  <td style={styles.td}>
                    {item.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(type, item.id, "approve")}
                          style={{ ...styles.actionBtn, backgroundColor: "#10b981", color: "white" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(type, item.id, "reject")}
                          style={{ ...styles.actionBtn, backgroundColor: "#ef4444", color: "white" }}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ color: "#6b7280" }}>—</span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const activeData = activeTab === "books" ? books : requests[activeTab];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Librarian Portal</div>
        <div onClick={handleHome} style={styles.sidebarLink(false)}>
          <i className="fas fa-home"></i> &nbsp; Home
        </div>
        <div onClick={() => setActiveTab("return")} style={styles.sidebarLink(activeTab === "return")}>
          <i className="fas fa-undo"></i> &nbsp; Return Requests
        </div>
        <div onClick={() => setActiveTab("borrow")} style={styles.sidebarLink(activeTab === "borrow")}>
          <i className="fas fa-book"></i> &nbsp; Borrow Requests
        </div>
        <div onClick={() => setActiveTab("books")} style={styles.sidebarLink(activeTab === "books")}>
          <i className="fas fa-book-open"></i> &nbsp; Manage Books
        </div>
        <div onClick={handleLogout} style={styles.sidebarLink(false)}>
          <i className="fas fa-sign-out-alt"></i> &nbsp; Logout
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Profile Section */}
        <div style={styles.profile}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
            alt="Profile"
            style={styles.profileImg}
          />
          <h2 style={styles.profileName}>{librarian.name}</h2>
          <p style={styles.profileId}>Librarian ID: {librarian.id}</p>
        </div>

        {activeTab === "home" ? (
          <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 8 }}>
            <h3>Welcome, {librarian.name}</h3>
            <p style={{ color: "#374151" }}>Use the left menu to view borrow / return / renew requests or manage books.</p>
          </div>
        ) : activeTab === "books" ? (
          <>
            <div style={{ maxWidth: 1100, margin: "20px auto", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={openAddModal}
                style={{ ...styles.actionBtn, backgroundColor: "#10b981", color: "white" }}
              >
                Add Book
              </button>
            </div>
            {renderTable(activeData, "books")}
          </>
        ) : (
          renderTable(activeData, activeTab)
        )}

        {/* Modal */}
        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>{modalType === "add" ? "Add Book" : "Edit Book"}</h3>
              <input
                style={styles.modalInput}
                placeholder="Title"
                value={currentBook.title}
                onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
              />
              <input
                style={styles.modalInput}
                placeholder="Author"
                value={currentBook.author}
                onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
              />
              <input
                style={styles.modalInput}
                type="number"
                placeholder="Quantity"
                value={currentBook.quantity}
                onChange={(e) => setCurrentBook({ ...currentBook, quantity: parseInt(e.target.value, 10) })}
              />
              <div style={{ textAlign: "right" }}>
                <button
                  style={{ ...styles.modalBtn, backgroundColor: "#10b981", color: "white" }}
                  onClick={saveBook}
                >
                  Save
                </button>
                <button
                  style={{ ...styles.modalBtn, backgroundColor: "#ef4444", color: "white" }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;
