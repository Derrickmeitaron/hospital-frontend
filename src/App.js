import React, { useEffect, useState } from "react";

function App() {
const [patients, setPatients] = useState([]);
const [selectedPatient, setSelectedPatient] = useState(null);

const fetchPatients = async () => {
const res = await fetch("http://127.0.0.1:5000/patients");
const data = await res.json();
setPatients(data);
};

const viewPatient = async (id) => {
const res = await fetch(`http://127.0.0.1:5000/patient/${id}`);
const data = await res.json();
setSelectedPatient(data);
};

useEffect(() => {
fetchPatients();
}, []);

return (
<div style={{ display: "flex", padding: "20px", gap: "40px" }}>

  {/* LEFT SIDE - PATIENT LIST */}
  <div>
    <h2>Patients</h2>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>

      <tbody>
        {patients.map((p) => (
          <tr
            key={p.id}
            onClick={() => viewPatient(p.id)}
            style={{ cursor: "pointer" }}
          >
            <td>{p.id}</td>
            <td>{p.first_name} {p.last_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* RIGHT SIDE - PATIENT DETAILS */}
  <div>
    <h2>Patient Details</h2>

    {selectedPatient ? (
      <div>
        <p><b>ID:</b> {selectedPatient.id}</p>
        <p><b>Name:</b> {selectedPatient.first_name} {selectedPatient.last_name}</p>
        <p><b>Gender:</b> {selectedPatient.gender}</p>
        <p><b>Phone:</b> {selectedPatient.phone}</p>
        <p><b>National ID:</b> {selectedPatient.national_id}</p>
      </div>
    ) : (
      <p>Click a patient to view details</p>
    )}
  </div>

</div>


);
}

export default App;
