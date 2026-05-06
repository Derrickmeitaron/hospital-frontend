import React, { useState } from "react";
import axios from "axios";

export default function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await axios.post("https://derrick.alwaysdata.net/login", {
        username,
        password
      });

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setRole(role);

    } catch (err) {
      setError(
        err?.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-card ${error ? "error-shake" : ""}`} style={{ maxWidth: "350px", margin: "100px auto" }}>
      <div style={styles.card}>

        <h2 style={styles.title}>🏥 Hospital System Login</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>

          <div style={styles.passwordWrapper}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.toggle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !username || !password}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)"
  },

  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "5px",
    textAlign: "center"
  },

  subtitle: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#666"
  },

  inputGroup: {
    marginBottom: "15px"
  },

  label: {
    fontSize: "13px",
    marginBottom: "5px",
    display: "block",
    color: "#444"
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },

  passwordWrapper: {
    position: "relative"
  },

  toggle: {
    position: "absolute",
    right: "10px",
    top: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "12px",
    color: "#2563eb"
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold"
  },
  

  errorBox: {
    marginTop: "12px",
    padding: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "6px",
    fontSize: "13px",
    textAlign: "center"
  }
};