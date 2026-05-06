import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const disableUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card">

      <h3>👤 System Users</h3>

      {users.map((u) => (
        <div key={u.id} className="patient-card">

          <b>{u.username}</b>

          <div>Role: {u.role}</div>
          <div>Status: {u.status}</div>

          {u.status !== "disabled" && (
            <button
              onClick={() => disableUser(u.id)}
              style={{ marginTop: "10px", background: "red" }}
            >
              Disable
            </button>
          )}

        </div>
      ))}

    </div>
  );
}