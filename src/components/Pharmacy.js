import React, { useEffect, useState, useCallback, useRef } from "react";
import theme from "../theme";
import {
  getPharmacyQueue,
  getRecords,
  dispenseMedication,
  searchPatients
} from "../api";

import notifySound from "../assets/notify.mp3";

export default function Pharmacy() {

  const [queue, setQueue] = useState([]);
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [mode, setMode] = useState("QUEUE");

  const prevQueueLengthRef = useRef(0);

  // =========================
  // SORT
  // =========================
  const sortByCreatedAt = (data) => {
    if (!Array.isArray(data)) return [];
    return [...data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  };

  // =========================
  // QUEUE
  // =========================
  const loadQueue = useCallback(async () => {
    try {
      const res = await getPharmacyQueue();

      const sorted = sortByCreatedAt(res.data);

      if (sorted.length > prevQueueLengthRef.current) {
        const audio = new Audio(notifySound);
        audio.play().catch(() => {});
      }

      setQueue(sorted);
      prevQueueLengthRef.current = sorted.length;

    } catch (err) {
      console.error(err);
    }
  }, []);

  // =========================
  // SEARCH (UNIFIED)
  // =========================
  const handleSearch = useCallback(async (text) => {
    try {
      if (!text.trim()) {
        setResults([]);
        return;
      }

      const res = await searchPatients(text);
      setResults(res.data || []);

    } catch (err) {
      console.error(err);
      setResults([]);
    }
  }, []);

  // =========================
  // SELECT PATIENT
  // =========================
  const selectPatient = async (p) => {
    setPatient(p);
    setQuery("");
    setResults([]);

    const res = await getRecords(p.id);
    setRecords(sortByCreatedAt(res.data));

    setMode("SEARCH");
  };

  // =========================
  // DISPENSE
  // =========================
  const handleDispense = async (id) => {
    try {
      await dispenseMedication(id);
      await loadQueue();

      if (patient) {
        const res = await getRecords(patient.id);
        setRecords(sortByCreatedAt(res.data));
      }

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, [loadQueue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, handleSearch]);

  // =========================
  // UI
  // =========================
  return (
    <div style={theme.container}>
      <div style={theme.header}>💊 Pharmacy Dashboard</div>

      <div style={{ marginBottom: "20px" }}>
        <div className="nav-buttons">
          <button style={theme.button} onClick={() => setMode("QUEUE")}>
            Queue Mode
          </button>
          <button style={theme.button} onClick={() => setMode("SEARCH")}>
            Search Mode
          </button>
        </div>
      </div>

      {/* =========================
          QUEUE MODE
      ========================= */}
      {mode === "QUEUE" && (
        <div>
          <h3>Live Queue</h3>

          {queue.map((item) => (
            <div key={item.id} style={theme.card}>
              <p><b>{item.first_name} {item.last_name}</b></p>
              <p><b>NID:</b> {item.national_id}</p>
              <p><b>Diagnosis:</b> {item.diagnosis}</p>
              <p><b>Prescription:</b> {item.prescription}</p>

              <button
                style={{ ...theme.button, backgroundColor: "green" }}
                onClick={() => handleDispense(item.id)}
              >
                Dispense
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          SEARCH MODE (UNIFIED)
      ========================= */}
      {mode === "SEARCH" && (
        <div>
          <h3>Search Patient</h3>

          <div style={{ position: "relative" }}>
            <input
              className="input-animated"
              placeholder="Search patient (name, ID, NID...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
              <div style={{
                position: "absolute",
                background: "#fff",
                border: "1px solid #ccc",
                width: "100%",
                zIndex: 999
              }}>
                {results.map((p) => (
                  <div
                    key={p.id}
                    style={{ padding: "10px", cursor: "pointer" }}
                    onClick={() => selectPatient(p)}
                  >
                    <b>{p.first_name} {p.last_name}</b>
                    <div>ID: {p.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {patient && (
            <div style={theme.card}>
              <h3>Patient Info</h3>
              <p>{patient.first_name} {patient.last_name}</p>
            </div>
          )}

          {records.map((r) => (
            <div key={r.id} style={theme.card}>
              <p><b>Diagnosis:</b> {r.diagnosis}</p>
              <p><b>Prescription:</b> {r.prescription}</p>

              <button
                style={{ ...theme.button, backgroundColor: "green" }}
                onClick={() => handleDispense(r.id)}
              >
                Dispense
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}