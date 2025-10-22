import React, { useEffect, useState } from "react";
import StudentSidebar from "../Components/StudentSidebar";

export default function DueDates() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState( sessionStorage.getItem("name") || "" );
  const [studentId, setStudentId] = useState( sessionStorage.getItem("reg_no") || "" );

  const email = sessionStorage.getItem("email");

  const fetchBorrows = async () => {
    if (!email) return setLoading(false);
    try {
      const res = await fetch(`http://127.0.0.1:5002/mybooks/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to load borrows");
      const data = await res.json();
      // only keep active borrows (ISSUED or ISSUE_PENDING). Returned/expired should not appear on this page
      const active = (data.books || []).filter((b) => b.status === 'ISSUED' || b.status === 'ISSUE_PENDING');
      setBorrows(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async () => {
    if (!email) return;
    try {
      const role = sessionStorage.getItem('role') || 'student';
      const res = await fetch(`http://127.0.0.1:5001/getUser?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
      if (!res.ok) throw new Error('Failed to load student');
      const data = await res.json();
      if (data.name) setStudentName(data.name);
      if (data.reg_no) setStudentId(data.reg_no);
      // also cache in sessionStorage for other pages
      if (data.name) sessionStorage.setItem('name', data.name);
      if (data.reg_no) sessionStorage.setItem('reg_no', data.reg_no);
    } catch (err) {
      console.error('Error fetching student:', err);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchBorrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReturn = async (borrow_id) => {
    try {
      const res = await fetch("http://127.0.0.1:5002/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrow_id }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Return failed");
      // optimistic: remove returned book from UI immediately
      setBorrows((prev) => prev.filter((item) => item.borrow_id !== borrow_id));
      alert("Return request successful");
      // refresh in background to ensure consistency
      fetchBorrows();
    } catch (err) {
      console.error(err);
      alert("Error processing return");
    }
  };

  const handleRenew = async (borrow_id) => {
    // ask user how many days to extend
    const input = prompt('Enter number of days to extend (max 60):', '14');
    if (input === null) return; // cancelled
    const days = parseInt(input, 10);
    if (isNaN(days) || days <= 0) return alert('Please enter a valid positive number');
    if (days > 60) return alert('Maximum 60 days allowed');

    try {
      const res = await fetch("http://127.0.0.1:5002/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrow_id, days }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Renew failed");
      // update local state immediately with new due date returned by the server
      setBorrows((prev) =>
        prev.map((item) =>
          item.borrow_id === borrow_id ? { ...item, due_date: data.newDueDate, renew_count: (item.renew_count || 0) + 1 } : item
        )
      );
      alert("Renew successful. New due: " + new Date(data.newDueDate).toLocaleDateString());
    } catch (err) {
      console.error(err);
      alert("Error processing renew");
    }
  };

  return (
    <>
      <style>{`
  .app-container { font-family: Arial, sans-serif; display: flex; min-height: 100vh; background: #f5f7fa; }
  .main { flex: 1; padding: 20px; margin-left: 0px; }
  .topbar { height: 60px; background: #fff; display:flex; align-items:center; justify-content:space-between; padding: 0 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); border-radius:6px }
  .profile { display:flex; flex-direction:column; align-items:center; gap:8px; padding:12px 0 }
  .profile img { width:90px; height:90px; border-radius:50%; border:3px solid #1f2937 }
        h2.section { margin-top:18px; margin-bottom:12px }
        table { width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.08); }
        th, td { padding:12px 15px; text-align:left; border-bottom:1px solid #eee }
        th { background:#1f2937; color:white }
        .status-due { color:orange; font-weight:600 }
        .status-overdue { color:red; font-weight:600 }
        .btn { padding:6px 12px; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-right:8px }
        .btn-renew { background:#38bdf8; color:white }
        .btn-return { background:#ef4444; color:white }
      `}</style>

      <div className="app-container">
        <StudentSidebar />
  <div className="main">
          <div className="topbar">
            <h2>Dues</h2>
            <div>Welcome, {sessionStorage.getItem("name") || "Student"}</div>
          </div>

          <div className="profile">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Student" />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>{studentName || 'Student Name'}</h3>
              <p style={{ margin: 0, color: '#4b5563' }}>{studentId ? `Student ID: ${studentId}` : ''}</p>
            </div>
          </div>

          <h2 className="section">📅 Books Due / Overdue</h2>

          {loading ? (
            <div>Loading...</div>
          ) : borrows.length === 0 ? (
            <div>No borrowed books found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b) => {
                  const due = new Date(b.due_date);
                  const today = new Date();
                  const isOverdue = (b.status === 'ISSUED' || b.status === 'ISSUE_PENDING') && today > due;
                  return (
                    <tr key={b.borrow_id}>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>{new Date(b.issue_date).toLocaleDateString()}</td>
                      <td>{due.toLocaleDateString()}</td>
                      <td className={isOverdue ? 'status-overdue' : 'status-due'}>{isOverdue ? 'Overdue' : 'Due Soon'}</td>
                      <td>
                        <button className="btn btn-renew" onClick={() => handleRenew(b.borrow_id)}>Renew</button>
                        <button className="btn btn-return" onClick={() => handleReturn(b.borrow_id)}>Return</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
