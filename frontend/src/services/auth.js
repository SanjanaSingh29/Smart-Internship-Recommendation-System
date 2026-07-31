import api from "./api";

// REGISTER
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// LOGIN
export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// GET PROFILE
export const getStudentProfile = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

// UPDATE PROFILE
export const updateStudentProfile = async (id, formData) => {
  const response = await api.put(`/students/${id}`, formData);
  return response.data;
};