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
// AUTH INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// RESPONSE NORMALIZER (NEW - IMPORTANT FIX)
// =========================
const normalize = (res) => {
  return (
    res?.data?.data ||
    res?.data?.patients ||
    res?.data?.results ||
    res?.data ||
    []
  );
};

// =========================
// PATIENT APIS
// =========================

// Get all patients
export const getPatients = async () => {
  const res = await api.get("/patients");
  return { data: normalize(res) };
};

// Get single patient
export const getPatient = async (id) => {
  const res = await api.get(`/patient/${id}`);
  return { data: res?.data?.data || res?.data };
};

// =========================
// SEARCH PATIENTS (FIXED)
// =========================
export const searchPatients = async (query) => {
  const res = await api.get(`/patients/search?q=${query}`);

  const data = normalize(res);

  return { data };
};

// =========================
// MEDICAL RECORDS
// =========================

export const getRecords = async (patientId) => {
  const res = await api.get(`/records/${patientId}`);
  return { data: normalize(res) };
};

export const addRecord = (data) =>
  api.post("/add_record", data);

// =========================
// PHARMACY MODULE
// =========================

export const getPharmacyRecordsByNID = (nid) =>
  api.get(`/pharmacy/records/nid/${nid}`);

export const getPharmacyRecords = async (patientId) => {
  const res = await api.get(`/pharmacy/records/${patientId}`);
  return { data: normalize(res) };
};

export const dispenseMedication = (recordId) =>
  api.put(`/pharmacy/dispense/${recordId}`);

export const getPharmacyQueue = () =>
  api.get("/pharmacy/queue");

// =========================
// ADMIN MODULE
// =========================

export const getUsers = () => api.get("/admin/users");

export const createUser = (data) =>
  api.post("/admin/users", data);

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export const getAdminPatient = (id) =>
  api.get(`/admin/patient/${id}`);

// =========================
// AUTH
// =========================

export const loginUser = (data) =>
  api.post("/login", data);

// =========================
// EXPORT
// =========================
export default api;