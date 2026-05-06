import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminPatients() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(res.data);

    } catch (err) {
      console.error(err);
      alert("Patient not found");
    }
  };

  return (
    <div className="card">

      <h3>🧾 Full Patient View</h3>

      <input
        placeholder="Enter patient ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={fetchPatient}>
        Search
      </button>

      {data && (
        <div>

          <h4>Patient</h4>
          <p>{data.patient.first_name} {data.patient.last_name}</p>

          <h4>Medical Records</h4>

          {data.records.map((r) => (
            <div key={r.id} className="record-card">
              <p><b>Diagnosis:</b> {r.diagnosis}</p>
              <p><b>Prescription:</b> {r.prescription}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}