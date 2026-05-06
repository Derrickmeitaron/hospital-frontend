import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminCreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");

  const createUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/admin/users`,
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("User created!");

      setUsername("");
      setPassword("");
      setRole("doctor");

    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  return (
    <div className="card">

      <h3>➕ Create User</h3>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="doctor">Doctor</option>
        <option value="reception">Reception</option>
        <option value="pharmacy">Pharmacy</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={createUser}>
        Create User
      </button>

    </div>
  );
}