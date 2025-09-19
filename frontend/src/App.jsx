import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import Owner from "./pages/Owner.jsx";
import Admin from "./pages/Admin.jsx";
import { clearToken } from "./auth";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function onLogout() {
    clearToken();
    setUser(null);
    navigate("/"); // back to home
  }

  function handleLogin(u) {
    setUser(u);
    if (u.role === "admin") navigate("/admin");
    else if (u.role === "owner") navigate("/owner");
    else navigate("/user");
  }

  function handleRegister(u) {
    setUser(u);
    navigate("/user");
  }

  return (
    <div className="container">
      <header>
        <h1>Store Ratings Platform</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/user">User</Link>
          <Link to="/owner">Owner</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <div>
          {user ? (
            <div>
              <span>
                {user.name} ({user.role})
              </span>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/user" element={<User />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/admin" element={<Admin />} />
          {/* fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
