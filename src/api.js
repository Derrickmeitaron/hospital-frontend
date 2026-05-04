import axios from "axios";

// =========================
// BASE CONFIG
// =========================
const api = axios.create({
  baseURL: "https://derrick.alwaysdata.net",
  headers: {
    "Content-Type": "application/json"
  }
});

// =========================
// PATIENT APIS
// =========================

// Get all patients
export const getPatients = () => api.get("/patients");

// Get single patient by ID
export const getPatient = (id) => api.get(`/patient/${id}`);

// Search patient by National ID
export const searchPatientByNID = (nid) =>
  api.get(`/patient/search/${nid}`);

// =========================
// MEDICAL RECORDS
// =========================

// Get records for a patient
export const getRecords = (patientId) =>
  api.get(`/records/${patientId}`);

// Add new medical record
export const addRecord = (data) =>
  api.post("/add_record", data);

export const getPharmacyRecordsByNID = (nid) =>
  api.get(`/pharmacy/records/nid/${nid}`);

// =========================
// PHARMACY MODULE
// =========================

// Get pharmacy records for a patient
export const getPharmacyRecords = (patientId) =>
  api.get(`/pharmacy/records/${patientId}`);

// Dispense medication (IMPORTANT FIX: lowercase path)
export const dispenseMedication = (recordId) =>
  api.put(`/pharmacy/dispense/${recordId}`);

// pharmacy queue
export const getPharmacyQueue = () =>
  api.get("/pharmacy/queue");

// =========================
// EXPORT DEFAULT (optional)
// =========================
export default api;