import React, { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [stats, setStats] = useState({});
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);

  // --- USERS ---
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", address: "", role: "user", password: "" });

  // --- STORES ---
  const [editingStore, setEditingStore] = useState(null);
  const [storeForm, setStoreForm] = useState({ name: "", address: "", owner_id: "" });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const statsRes = await api.get("/admin/dashboard"); // ✅ corrected endpoint
    const storesRes = await api.get("/admin/stores");
    const usersRes = await api.get("/admin/users");

    setStats(statsRes.data);
    setStores(storesRes.data);
    setUsers(usersRes.data);
    setOwners(usersRes.data.filter(u => u.role === "owner"));
  };

  /* ---------------- USERS CRUD ---------------- */
  const handleCreateUser = async (e) => {
    e.preventDefault();
    await api.post("/admin/users", userForm);
    setUserForm({ name: "", email: "", address: "", role: "user", password: "" });
    refresh();
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await api.put(`/admin/users/${editingUser}`, userForm);
    setEditingUser(null);
    setUserForm({ name: "", email: "", address: "", role: "user", password: "" });
    refresh();
  };

  const handleDeleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    refresh();
  };

  /* ---------------- STORES CRUD ---------------- */
  const handleCreateStore = async (e) => {
    e.preventDefault();
    await api.post("/admin/stores", storeForm);
    setStoreForm({ name: "", address: "", owner_id: "" });
    refresh();
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    await api.put(`/admin/stores/${editingStore}`, storeForm);
    setEditingStore(null);
    setStoreForm({ name: "", address: "", owner_id: "" });
    refresh();
  };

  const handleDeleteStore = async (id) => {
    await api.delete(`/admin/stores/${id}`);
    refresh();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Stats */}
      <div className="stats">
        <div className="card"><h2>{stats.users}</h2><p>Total Users</p></div>
        <div className="card"><h2>{stats.stores}</h2><p>Total Stores</p></div>
        <div className="card"><h2>{stats.ratings}</h2><p>Total Ratings</p></div>
      </div>

      {/* Users Section */}
      <h3>Users</h3>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => { setEditingUser(u.id); setUserForm(u); }}>✏️ Edit</button>
                <button onClick={() => handleDeleteUser(u.id)} style={{ background: "red" }}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="card">
        <h3>{editingUser ? "Edit User" : "Create User"}</h3>
        <input
          placeholder="Name"
          value={userForm.name}
          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={userForm.email}
          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
        />
        <input
          placeholder="Address"
          value={userForm.address}
          onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
        />
        <select
          value={userForm.role}
          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={userForm.password}
          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
        />
        <button type="submit">{editingUser ? "Save" : "Create"}</button>
        {editingUser && <button onClick={() => setEditingUser(null)}>Cancel</button>}
      </form>

      {/* Stores Section */}
      <h3>Stores</h3>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Address</th><th>Owner</th><th>Avg Rating</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{owners.find(o => o.id === s.owner_id)?.name || "Unassigned"}</td>
              <td>{s.avg_rating || "—"}</td>
              <td>
                <button onClick={() => { setEditingStore(s.id); setStoreForm(s); }}>✏️ Edit</button>
                <button onClick={() => handleDeleteStore(s.id)} style={{ background: "red" }}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={editingStore ? handleUpdateStore : handleCreateStore} className="card">
        <h3>{editingStore ? "Edit Store" : "Create Store"}</h3>
        <input
          placeholder="Store Name"
          value={storeForm.name}
          onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
        />
        <input
          placeholder="Address"
          value={storeForm.address}
          onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
        />
        <select value={storeForm.owner_id} onChange={(e) => setStoreForm({ ...storeForm, owner_id: e.target.value })}>
          <option value="">Select Owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>
        <button type="submit">{editingStore ? "Save" : "Create"}</button>
        {editingStore && <button onClick={() => setEditingStore(null)}>Cancel</button>}
      </form>
    </div>
  );
}
