import React, { useEffect, useState } from "react";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost:5002/borrowRequests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching borrow requests:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openModal = (request) => {
    setSelectedRequest(request);
    setTokenInput("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleApprove = async () => {
    if (!tokenInput.trim()) {
      setErrorMsg("Please enter the token");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5002/borrowRequests/${selectedRequest.borrow_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", token: tokenInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid token or request already processed");
      } else {
        setModalOpen(false);
        fetchRequests(); // refresh list
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  };

  if (loading) return <div>Loading borrow requests...</div>;
  if (!requests.length) return <div>No pending borrow requests found.</div>;

  return (
    <div style={styles.tableContainer}>
      <h3>Pending Borrow Requests</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Book</th>
            <th style={styles.th}>Issue Date</th>
            <th style={styles.th}>Due Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.borrow_id}>
              <td style={styles.td}>{req.student_name}</td>
              <td style={styles.td}>{req.book_title}</td>
              <td style={styles.td}>{req.issue_date}</td>
              <td style={styles.td}>{req.due_date}</td>
              <td style={{ ...styles.td, color: "#D97706", fontWeight: "600" }}>
                {req.status}
              </td>
              <td style={styles.td}>
                <button style={styles.approveBtn} onClick={() => openModal(req)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Enter Token for Approval</h3>
            <input
              style={styles.input}
              type="text"
              placeholder="Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            {errorMsg && <div style={styles.error}>{errorMsg}</div>}
            <div style={styles.modalBtns}>
              <button style={styles.approveBtn} onClick={handleApprove}>
                Approve
              </button>
              <button style={styles.cancelBtn} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  tableContainer: {
    width: "100%",
    maxWidth: "900px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "20px",
    marginTop: 20,
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "8px",
    color: "#111827",
  },
  approveBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  input: {
    width: "80%",
    padding: "8px",
    margin: "15px 0",
    borderRadius: "5px",
    border: "1px solid #d1d5db",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  modalBtns: {
    display: "flex",
    justifyContent: "space-around",
  },
};

export default BorrowRequests;