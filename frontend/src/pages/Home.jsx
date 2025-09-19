import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="card">
      <h2>Welcome to Ratings Platform</h2>
      <p>Select your role </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link to="/user"><button>User </button></Link>
        <Link to="/owner"><button>Store </button></Link>
        <Link to="/admin"><button>Admin</button></Link>
      </div>
    </div>
  );
}
