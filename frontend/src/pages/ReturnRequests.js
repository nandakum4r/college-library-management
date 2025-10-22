import React, { useEffect, useState } from "react";

const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5002/returnRequests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (request) => {
    setActiveRequest(request);
    setTokenInput("");
  };

  const submitToken = async () => {
    if (!tokenInput.trim()) return;

    try {
      const res = await fetch(`http://localhost:5002/returnRequests/${activeRequest.borrow_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", token: tokenInput }),
      });

      const data = await res.json();
      alert(data.message);
      setActiveRequest(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading return requests...</div>;
  if (!requests.length) return <div>No pending return requests found.</div>;

  return (
    <div style={styles.tableContainer}>
      <h3>Pending Return Requests</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Book</th>
            <th style={styles.th}>Return Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.borrow_id}>
              <td style={styles.td}>{req.student_name}</td>
              <td style={styles.td}>{req.book_title}</td>
              <td style={styles.td}>{req.return_date || "Pending"}</td>
              <td style={{ ...styles.td, color: "#D97706", fontWeight: "600" }}>{req.status}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleApprove(req)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeRequest && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h4>Enter token to approve return</h4>
            <input
              style={styles.input}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Token"
            />
            <div style={styles.modalButtons}>
              <button style={styles.button} onClick={submitToken}>Submit</button>
              <button style={styles.button} onClick={() => setActiveRequest(null)}>Cancel</button>
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
  button: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: 5,
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalButtons: { display: "flex", justifyContent: "center" },
};

export default ReturnRequests;
