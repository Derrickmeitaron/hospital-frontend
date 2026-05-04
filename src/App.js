import "./App.css";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import theme from "./theme";

import {
  getPatients,
  getPatient,
  getRecords,
  addRecord,
  searchPatientByNID
} from "./api";

import Pharmacy from "./components/Pharmacy";
import Reception from "./components/Reception";

function App() {
  // =========================
  // STATE
  // =========================
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);

  const [diagnosis, setDiagnosis] = useState("");
  const [testResults, setTestResults] = useState("");
  const [prescription, setPrescription] = useState("");

  const [nid, setNid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [notifications, setNotifications] = useState(0);

  const [role, setRole] = useState(null);
  const [view, setView] = useState(null);
  const [showRecords, setShowRecords] = useState(false);
  const isRecordValid =
    diagnosis.trim().length > 0;
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // =========================
  // LOAD USER ROLE
  // =========================
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (savedRole && token) {
      setRole(savedRole);
      setView(savedRole);
    } else {
      setView("doctor");
    }
  }, []);

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const res = await getPatients();

      const sorted = Array.isArray(res.data)
        ? [...res.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        : [];

      setPatients(sorted);
    } catch (err) {
      console.error("Error loading patients:", err);
    }
  };
  // =========================
  // SEARCH PATIENT
  // =========================
  const searchPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await searchPatientByNID(nid);

      setSelectedPatient(res.data.patient);
      setRecords(
        Array.isArray(res.data.records)
          ? [...res.data.records].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
          : []
      );

    } catch (err) {
      console.error(err);
      setError("Patient not found");
      setSelectedPatient(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW PATIENT
  // =========================
  const viewPatient = async (id) => {
    try {
      const res1 = await getPatient(id);
      setSelectedPatient(res1.data);

      const res2 = await getRecords(id);
      setRecords(
        Array.isArray(res2.data)
          ? [...res2.data].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
          : []
      );
    } catch (err) {
      console.error("Error loading patient details:", err);
    }
  };
  const calculateAge = (dob) => {
    if (!dob) return null;

    const today = new Date();
    const birth = new Date(dob);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // =========================
  // ADD RECORD
  // =========================
  const handleAddRecord = async () => {
    try {
      if (!selectedPatient) {
        alert("Please select a patient first");
        return;
      }

      if (!diagnosis.trim()) {
        alert("Diagnosis is required");
        return;
      }

      // reset states before request
      setSaving(true);
      setSaveError(false);
      setSaveSuccess(false);

      const payload = {
        patient_id: selectedPatient.id,
        diagnosis,
        test_results: testResults,
        prescription
      };

      await addRecord(payload);

      const updated = await getRecords(selectedPatient.id);

      const sortedRecords = Array.isArray(updated.data)
        ? [...updated.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        : [];

      setRecords(sortedRecords);
      // clear form
      setDiagnosis("");
      setTestResults("");
      setPrescription("");

      // success state
      setSaveSuccess(true);
      setSaveError(false);

      setTimeout(() => setSaveSuccess(false), 2000);

    } catch (error) {
      console.error(error);

      // error state
      setSaveError(true);
      setSaveSuccess(false);

      setTimeout(() => setSaveError(false), 2500);

      alert(error?.response?.data?.error || "Failed to save record");

    } finally {
      setSaving(false);
    }
  }; // =========================
  // LOAD PATIENTS ON START
  // =========================
  useEffect(() => {
    fetchPatients();
  }, []);

  // =========================
  // VIEW SWITCHER
  // =========================
  const renderView = () => {
    if (view === "pharmacy") return <Pharmacy setNotifications={setNotifications} />;
    if (view === "reception") return <Reception />;

    return (
      <div className="doctor-layout">

        {/* LEFT PANEL */}
        <div className="doctor-left">

          <div className="card">
            <h2>👨‍⚕️ Doctor Dashboard</h2>

            <div className="nav-buttons">
              <button onClick={() => setView("doctor")}>Doctor</button>
              <button onClick={() => setView("reception")}>Reception</button>
              <button onClick={() => setView("pharmacy")}>Pharmacy</button>
            </div>
          </div>

          <div className="card">
            <h3>🔍 Search Patient</h3>

            <input
              className="input-animated"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              placeholder="Enter National ID"
            />

            <button onClick={searchPatient}>Search</button>

            {loading && <p>Searching...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div className="card">
            <h3>📋 Patients</h3>

            <div className="patient-list">
              {patients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => viewPatient(p.id)}
                  className={`patient-card ${selectedPatient?.id === p.id ? "active-patient" : ""
                    }`}
                >
                  <div className="patient-name">
                    {p.first_name} {p.last_name}
                  </div>

                  <div className="patient-meta">
                    ID: {p.id}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="doctor-right">

          <div className="card">
            <h2>🧾 Patient Details</h2>

            {selectedPatient ? (
              <>
                <div className="patient-summary-card">

                  <h2>🧾 Patient Profile</h2>

                  <div className="patient-grid">

                    <div className="patient-field">
                      <span className="label">Full Name</span>
                      <span className="value">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </span>
                    </div>

                    <div className="patient-field">
                      <span className="label">Age</span>
                      <span className="value">
                        {calculateAge(selectedPatient.date_of_birth)} years
                      </span>
                    </div>

                    <div className="patient-field">
                      <span className="label">Gender</span>
                      <span className="value">
                        {selectedPatient.gender || "Not set"}
                      </span>
                    </div>

                    <div className="patient-field">
                      <span className="label">National ID</span>
                      <span className="value">
                        {selectedPatient.national_id || "N/A"}
                      </span>
                    </div>

                  </div>

                </div>

                <h3>➕ Add Record</h3>

                <div className="clinical-section">

                  <div className="clinical-block">
                    <label>🩺 Diagnosis</label>
                    <textarea
                      className="clinical-input"
                      placeholder="Enter clinical diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>

                  <div className="clinical-block">
                    <label>🧪 Test Results</label>
                    <textarea
                      className="clinical-input"
                      placeholder="Enter lab/imaging results..."
                      value={testResults}
                      onChange={(e) => setTestResults(e.target.value)}
                    />
                  </div>

                  <div className="clinical-block">
                    <label>💊 Prescription</label>
                    <textarea
                      className="clinical-input"
                      placeholder="Enter medication & dosage..."
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                    />
                  </div>

                </div>
                <button
                  style={{
                    ...theme.button,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                    background: saveError
                      ? "#dc2626"
                      : saveSuccess
                        ? "#16a34a"
                        : "#2563eb"
                  }}
                  onClick={handleAddRecord}
                  disabled={saving || !isRecordValid}
                >
                  {saving
                    ? "Saving..."
                    : saveError
                      ? "Failed ❌"
                      : saveSuccess
                        ? "Saved ✓"
                        : "Save Record"}
                </button>
                {!isRecordValid && (
                  <p style={{ color: "orange", fontSize: "12px" }}>
                    Diagnosis is required to save record
                  </p>
                )}
              </>
            ) : (
              <p>Select a patient to view details</p>
            )}<br /><br />

            <button
              style={{ ...theme.button, marginTop: "10px" }}
              onClick={() => setShowRecords(!showRecords)}
            >
              📜 Track Records
            </button>
            {showRecords && (
              <div style={{ marginTop: "15px" }}>
                <h3>📜 Medical History</h3>

                {records.length === 0 ? (
                  <p>No records found</p>
                ) : (
                  records.map((r) => (
                    <div key={r.id} className="record-card">
                      <p><b>Diagnosis:</b> {r.diagnosis}</p>
                      <p><b>Prescription:</b> {r.prescription}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  // =========================
  // APP ROOT
  // =========================
  return (
    <div>
      <Header notifications={notifications} />
      {renderView()}
    </div>
  );
}

export default App;