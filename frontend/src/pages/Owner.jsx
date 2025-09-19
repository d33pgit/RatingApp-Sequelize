import React, { useEffect, useState } from "react";
import api from "../api";

export default function Owner() {
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({ name: "", address: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get("/stores/mine")
      .then((res) => setStore(res.data))
      .catch(() => setStore(null));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/stores/mine", form);
    setStore(data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/stores/mine", form);
    setStore(data);
    setEditing(false);
  };

  const handleDelete = async () => {
    await api.delete("/stores/mine");
    setStore(null);
  };

  if (!store) {
    return (
      <div className="card">
        <h2>Create Your Store</h2>
        <form onSubmit={handleCreate}>
          <input
            placeholder="Store Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button type="submit">Create Store</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>My Store</h2>

      {!editing ? (
        <div className="card">
          <h3>{store.name}</h3>
          <p>{store.address}</p>
          <button onClick={() => setEditing(true)}>✏️ Edit</button>
          <button onClick={handleDelete} style={{ background: "red" }}>
            🗑️ Delete
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="card">
          <input
            placeholder="Store Name"
            value={form.name || store.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Address"
            value={form.address || store.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button type="submit">Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
