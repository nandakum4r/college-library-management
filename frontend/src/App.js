import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

// Admin/dashboard pages
import Dashboard from "./pages/Dashboard";
import ManageStudents from "./pages/ManageStudents";
import AddStudents from "./pages/AddStudents";
import EditStudent from "./pages/EditStudent";
import Reports from "./pages/Reports";
import ManageLibrarians from "./pages/ManageLibrarians";
import AddLibrarian from "./pages/AddLibrarian";
import EditLibrarian from "./pages/EditLibrarian";
import StudentDashboard from "./pages/StudentDashboard";
import BorrowBooks from "./pages/BorrowBooks";
import MyBooks from "./pages/MyBooks";
import DueDates from "./pages/DueDates";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import AddBook from "./pages/AddBook";
import DeleteBook from "./pages/DeleteBook";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin/Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<ManageStudents />} />
        <Route path="/addstudents" element={<AddStudents />} />
        <Route path="/editstudent" element={<EditStudent />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/librarians" element={<ManageLibrarians />} />
        <Route path="/addlibrarian" element={<AddLibrarian />} />
        <Route path="/editlibrarian" element={<EditLibrarian />} />
        <Route path="/edit-student/:reg_no" element={<EditStudent />} />
        <Route path="/manage-librarians" element={<ManageLibrarians />} />
        <Route path="/add-librarian" element={<AddLibrarian />} />
        <Route path="/edit-librarian/:id" element={<EditLibrarian />} /> {/* Dynamic */}

        {/* Student Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Other Pages */}
        <Route path="/borrow" element={<BorrowBooks />} />
        <Route path="/myBooks" element={<MyBooks />} />
        <Route path="/dueDates" element={<DueDates />} />
        
        <Route path="/librarianDashboard" element={<LibrarianDashboard />} />
        <Route path="/addbook" element={<AddBook  />} />
        <Route path="/deletebook" element={<DeleteBook   />} />
      </Routes>
    </Router>
  );
}

export default App;
