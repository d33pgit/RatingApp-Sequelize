import React, { useEffect, useState } from "react";
import api from "../api";

export default function User() {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/stores").then((res) => setStores(res.data));
  }, []);

  const handleRate = async (storeId, rating) => {
    await api.post("/ratings", { storeId, rating });
    const { data } = await api.get("/stores");
    setStores(data);
  };

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>All Stores</h2>
      <input
        placeholder="Search by name or address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.avgRating?.toFixed(1) || "—"}</td>
              <td>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      className="star-button"
                      onClick={() => handleRate(s.id, r)}
                    >
                      {r <= (s.userRating || 0) ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
