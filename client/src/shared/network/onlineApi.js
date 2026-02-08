import axios from "axios";

// Auth endpoints
export const registerOnline = async (user) => {
  const res = await axios.post("/api/auth/register", user);
  return res.data;
};

export const loginOnline = async (user) => {
  const res = await axios.post("/api/auth/login", user);
  return res.data;
};

export const refreshOnline = async () => {
  const res = await axios.post("/api/auth/refresh", null);
  return res.data;
};

export const verifyCodeOnline = async (payload) => {
  const res = await axios.post("/api/auth/verify-code", payload);
  return res.data;
};

export const resendCodeOnline = async (payload) => {
  const res = await axios.post("/api/auth/resend-code", payload);
  return res.data;
};

export const logoutOnline = async () => {
  await axios.post("/api/auth/logout", null);
  return true;
};

// Generic REST helpers
export const listOnline = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

export const getOnline = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

export const createOnline = async (url, body) => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updateOnline = async (url, body) => {
  const res = await axios.patch(url, body);
  return res.data;
};

export const deleteOnline = async (url) => {
  const res = await axios.delete(url);
  return res.data ?? true;
};
