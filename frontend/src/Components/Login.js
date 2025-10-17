import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate(); // ✅ for redirection

  // Fetch role from sessionStorage on mount
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save login session
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("role", role);

      alert(`Login successful as ${role}!`);
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/home");
}
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f0f2f5;
          font-family: "Segoe UI", sans-serif;
        }
        .auth-container h2 {
          margin-bottom: 20px;
          color: #2e3b4e;
          font-size: 28px;
        }
        .auth-container form {
          display: flex;
          flex-direction: column;
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0px 6px 12px rgba(0,0,0,0.1);
          width: 320px;
        }
        .auth-container input {
          margin-bottom: 15px;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .auth-container input:focus {
          outline: none;
          border-color: #2e3b4e;
          box-shadow: 0 0 4px rgba(46, 59, 78, 0.4);
        }
        .auth-container button {
          padding: 12px;
          background-color: #2e3b4e;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }
        .auth-container button:hover {
          background-color: #1f2a38;
        }
        .auth-container p {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
        }
        .auth-container a {
          color: #2e3b4e;
          font-weight: bold;
          text-decoration: none;
        }
        .auth-container a:hover {
          text-decoration: underline;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center" }}>
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <Link to="/signup" onClick={() => sessionStorage.setItem("role", role)}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}