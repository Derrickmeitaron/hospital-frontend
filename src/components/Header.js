import React from "react";
import logo from "../assets/logo.png";

export default function Header({ notifications = 0 }) {

  const role = localStorage.getItem("role") || "Guest";

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="app-header">

      {/* LEFT */}
      <div className="header-left">
        <img src={logo} alt="logo" className="logo" />

        <div className="title">
          <h1>Prime Health Medical Centre</h1>
          <span className="subtitle">Hospital Management System</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="header-center">
        <span className="role-badge">👤 {role.toUpperCase()}</span>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        <div className="notif">
          🔔

          {notifications > 0 && (
            <span className="notif-badge">{notifications}</span>
          )}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}