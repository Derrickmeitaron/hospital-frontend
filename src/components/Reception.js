import React, { useState } from "react";
import axios from "axios";
import theme from "../theme";

const api = axios.create({
  baseURL: "https://derrick.alwaysdata.net",
  headers: {
    "Content-Type": "application/json"
  }
});

function Reception() {

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    phone: "",
    date_of_birth: "",
    national_id: "",
    guardian_national_id: ""
  });

  const [age, setAge] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "date_of_birth") {
      const today = new Date();
      const dob = new Date(value);

      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    }
  };

  const registerPatient = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!form.first_name || !form.last_name || !form.date_of_birth) {
        setMessage("Please fill all required fields");
        return;
      }

      if (age >= 18 && !form.national_id) {
        setMessage("Adult must have National ID");
        return;
      }

      if (age < 18 && !form.guardian_national_id) {
        setMessage("Child must have Guardian National ID");
        return;
      }

      const res = await api.post("/add_patient", form);
      setMessage(res.data.message);

      setForm({
        first_name: "",
        last_name: "",
        gender: "",
        phone: "",
        date_of_birth: "",
        national_id: "",
        guardian_national_id: ""
      });

      setAge(null);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  const searchPatient = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.get(`/patient/search/${searchId}`);
      setPatient(res.data.patient);

    } catch (err) {
      console.error(err);
      setPatient(null);
      setMessage("Patient not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={theme.container}>

      {/* CENTER PAGE */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}>

        <div style={{ ...theme.card, width: "520px", padding: "30px" }}>

          <div style={theme.header}>🏥 Reception</div>

          {/* FORM COLUMN WRAPPER */}
          <div style={{ display: "flex", flexDirection: "column" }}>

            <h3>Register Patient</h3>

            <input className="input-animated" name="first_name" placeholder="First Name" onChange={handleChange} value={form.first_name} />

            <input className="input-animated" name="last_name" placeholder="Last Name" onChange={handleChange} value={form.last_name} />

            <select className="input-animated" name="gender" onChange={handleChange} value={form.gender}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input className="input-animated" name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />

            <input className="input-animated" type="date" name="date_of_birth" onChange={handleChange} value={form.date_of_birth} />

            {age !== null && <p><b>Age:</b> {age} years</p>}

            {age !== null && age >= 18 && (
              <input
                className="input-animated"
                name="national_id"
                placeholder="National ID"
                onChange={handleChange}
                value={form.national_id}
              />
            )}

            {age !== null && age < 18 && (
              <input
                className="input-animated"
                name="guardian_national_id"
                placeholder="Guardian National ID"
                onChange={handleChange}
                value={form.guardian_national_id}
              />
            )}

            <button style={theme.button} onClick={registerPatient} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            {message && <p>{message}</p>}

            <hr />

            <h3>Search Patient</h3>

            <input
              className="input-animated"
              placeholder="Enter National ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />

            <button style={theme.button} onClick={searchPatient}>
              Search
            </button>

            {patient && (
              <div style={{ marginTop: "15px" }}>
                <h4>Patient Found</h4>
                <p><b>Name:</b> {patient.first_name} {patient.last_name}</p>
                <p><b>Gender:</b> {patient.gender}</p>
                <p><b>Phone:</b> {patient.phone}</p>
                <p><b>National ID:</b> {patient.national_id || "N/A"}</p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}

export default Reception;