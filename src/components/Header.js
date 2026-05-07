import React from "react";
import logo from "../assets/logo.png";

export default function Header({ notifications = 0, role, setView }) {
  console.log("HEADER ROLE:", role);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    if (setView) {
      setView("login");
    } else {
      window.location.reload();
    }
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
        <span className="role-badge">
          👤 {role ? role.toUpperCase() : "GUEST"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        {/* PHARMACY ONLY NOTIFICATIONS */}
        {role === "pharmacy" && (
          <div className="notif">
            🔔

            {notifications > 0 && (
              <span className="notif-badge">
                {notifications}
              </span>
            )}
          </div>
        )}

        {/* LOGOUT ONLY WHEN LOGGED IN */}
        {role && role !== "login" && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
        

      </div>
      

    </div>
    
  );
  
}
