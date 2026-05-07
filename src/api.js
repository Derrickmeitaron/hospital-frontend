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
// SAFE RESPONSE NORMALIZER
// =========================
const normalize = (res) => {
  const raw =
    res?.data?.data ||
    res?.data?.patients ||
    res?.data?.results ||
    res?.data ||
    [];

  return Array.isArray(raw) ? raw : [];
};

// =========================
// PATIENT APIS
// =========================

// Get all patients
export const getPatients = async () => {
  const res = await api.get("/patients");

  return {
    data: normalize(res)
  };
};

// Get single patient
export const getPatient = async (id) => {
  const res = await api.get(`/patient/${id}`);

  return {
    data: res?.data?.data || res?.data || null
  };
};

// =========================
// SEARCH PATIENTS
// =========================
export const searchPatients = async (query) => {
  const res = await api.get(
    `/patients/search?q=${encodeURIComponent(query)}`
  );

  return {
    data: normalize(res)
  };
};

// =========================
// MEDICAL RECORDS
// =========================
export const getRecords = async (patientId) => {
  const res = await api.get(`/records/${patientId}`);

  return {
    data: normalize(res)
  };
};

export const addRecord = async (data) => {
  const res = await api.post("/add_record", data);

  return {
    data: res?.data || {}
  };
};

// =========================
// PHARMACY MODULE
// =========================
export const getPharmacyRecordsByNID = async (nid) => {
  const res = await api.get(
    `/pharmacy/records/nid/${encodeURIComponent(nid)}`
  );

  return {
    data: res?.data || {}
  };
};

export const getPharmacyRecords = async (patientId) => {
  const res = await api.get(`/pharmacy/records/${patientId}`);

  return {
    data: normalize(res)
  };
};

export const dispenseMedication = async (recordId) => {
  const res = await api.put(`/pharmacy/dispense/${recordId}`);

  return {
    data: res?.data || {}
  };
};

export const getPharmacyQueue = async () => {
  const res = await api.get("/pharmacy/queue");

  return {
    data: normalize(res)
  };
};

// =========================
// ADMIN MODULE
// =========================

// Get all users (FIXED SAFE VERSION)
export const getUsers = async () => {
  const res = await api.get("/admin/users");

  const raw =
    res?.data?.data ||
    res?.data?.users ||
    res?.data ||
    [];

  return {
    data: Array.isArray(raw) ? raw : []
  };
};

// Create user
export const createUser = async (data) => {
  const res = await api.post("/admin/users", data);

  return {
    data: res?.data || {}
  };
};

// Delete user
export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);

  return {
    data: res?.data || {}
  };
};

// Admin patient view
export const getAdminPatient = async (id) => {
  const res = await api.get(`/admin/patient/${id}`);

  return {
    data: res?.data || {}
  };
};

// =========================
// AUTH
// =========================
export const loginUser = async (data) => {
  const res = await api.post("/login", data);

  return {
    data: res?.data || {}
  };
};

// =========================
// EXPORT
// =========================
export default api;