import React, { useEffect, useState, useCallback } from "react";
import theme from "../theme";
import {
  getPharmacyQueue,
  getPharmacyRecordsByNID,
  dispenseMedication
} from "../api";

import notifySound from "../assets/notify.mp3";

export default function Pharmacy() {

  // =========================
  // STATE
  // =========================
  const [queue, setQueue] = useState([]);
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);

  const [nationalId, setNationalId] = useState("");
  const [mode, setMode] = useState("QUEUE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [prevQueueLength, setPrevQueueLength] = useState(0);

  // =========================
  // LOAD QUEUE (REAL-TIME + SOUND)
  // =========================
  const loadQueue = useCallback(async () => {
    try {
      const res = await getPharmacyQueue();
      const newQueue = res.data;

      // 🔔 alert when new patient arrives
      if (newQueue.length > prevQueueLength) {
        const audio = new Audio(notifySound);
        audio.play().catch(() => {});
      }

      setQueue(newQueue);
      setPrevQueueLength(newQueue.length);

    } catch (err) {
      console.error(err);
    }
  }, [prevQueueLength]);

  // =========================
  // SEARCH BY NID
  // =========================
  const fetchByNID = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getPharmacyRecordsByNID(nationalId);

      setPatient(res.data.patient);
      setRecords(res.data.records);
      setMode("SEARCH");

    } catch (err) {
      console.error(err);
      setError("Patient not found");
      setPatient(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [nationalId]);

  // =========================
  // DISPENSE
  // =========================
  const handleDispense = async (id) => {
    try {
      await dispenseMedication(id);

      loadQueue();

      if (mode === "SEARCH" && nationalId) {
        fetchByNID();
      }

    } catch (err) {
      console.error(err);
      alert("Failed to dispense medication");
    }
  };

  // =========================
  // REAL-TIME QUEUE
  // =========================
  useEffect(() => {
    loadQueue();

    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);

  }, [loadQueue]);

  // =========================
  // REAL-TIME SEARCH
  // =========================
  useEffect(() => {
    if (mode === "SEARCH" && nationalId) {
      const interval = setInterval(fetchByNID, 5000);
      return () => clearInterval(interval);
    }
  }, [mode, nationalId, fetchByNID]);

  // =========================
  // STYLES
  // =========================
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial",
      minHeight: "100vh"
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px"
    },
    button: {
      padding: "10px 15px",
      marginRight: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "#fff"
    },
    card: {
      backgroundColor: "#fff",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "10px",
      color: "#080202",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    input: {
      padding: "10px",
      width: "250px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },
    pending: { color: "orange", fontWeight: "bold" },
    dispensed: { color: "green", fontWeight: "bold" }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={theme.container}>

      <div style={theme.header}>💊 Pharmacy Dashboard</div>

      {/* MODE SWITCH */}
      <div style={{ marginBottom: "20px" }}>
        <button style={theme.button} onClick={() => setMode("QUEUE")}>
          Queue Mode
        </button>

        <button style={theme.button} onClick={() => setMode("SEARCH")}>
          Search Mode
        </button>
      </div>

      {/* =========================
          QUEUE MODE
      ========================= */}
      {mode === "QUEUE" && (
        <div>
          <h3>Live Queue</h3>

          {queue.length === 0 && <p>No pending prescriptions</p>}

          {queue
            .slice()
            .reverse() // newest first
            .map((item) => (
              <div key={item.id} style={styles.card}>
                <p><b>{item.first_name} {item.last_name}</b></p>
                <p><b>NID:</b> {item.national_id}</p>
                <p><b>Diagnosis:</b> {item.diagnosis}</p>
                <p><b>Prescription:</b> {item.prescription}</p>

                <p>
                  <b>Status:</b>{" "}
                  <span style={styles.pending}>{item.status}</span>
                </p>

                <button
                  style={{ ...styles.button, backgroundColor: "green" }}
                  onClick={() => handleDispense(item.id)}
                >
                  Dispense
                </button>
              </div>
            ))}
        </div>
      )}

      {/* =========================
          SEARCH MODE
      ========================= */}
      {mode === "SEARCH" && (
        <div>
          <h3>Search Patient</h3>

          <input
            style={styles.input}
            placeholder="Enter National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />

          <button style={styles.button} onClick={fetchByNID}>
            Search
          </button>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {patient && (
            <div style={styles.card}>
              <h3>Patient Info</h3>
              <p><b>Name:</b> {patient.first_name} {patient.last_name}</p>
              <p><b>NID:</b> {patient.national_id}</p>
            </div>
          )}

          {records.map((r) => (
            <div key={r.id} style={styles.card}>
              <p><b>Diagnosis:</b> {r.diagnosis}</p>
              <p><b>Prescription:</b> {r.prescription}</p>

              <p>
                <b>Status:</b>{" "}
                <span style={
                  r.status === "PENDING"
                    ? theme.pending
                    : theme.dispensed
                }>
                  {r.status}
                </span>
              </p>

              {r.status === "PENDING" && (
                <button
                  style={{ ...styles.button, backgroundColor: "green" }}
                  onClick={() => handleDispense(r.id)}
                >
                  Dispense
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}