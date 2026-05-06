import React, { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminPatients from "./AdminPatients";
import AdminCreateUser from "./AdminCreateUser";

export default function AdminApp() {
  const [view, setView] = useState("users");

  const renderView = () => {
    switch (view) {
      case "users":
        return <AdminUsers />;
      case "patients":
        return <AdminPatients />;
      case "create":
        return <AdminCreateUser />;
      default:
        return <AdminUsers />;
    }
  };

  return (
    <div className="admin-layout">

      <div className="card">
        <h2>🛠 Admin Dashboard</h2>

        <div className="nav-buttons">
          <button onClick={() => setView("users")}>Users</button>
          <button onClick={() => setView("create")}>Create User</button>
          <button onClick={() => setView("patients")}>Patients</button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {renderView()}
      </div>

    </div>
  );
}