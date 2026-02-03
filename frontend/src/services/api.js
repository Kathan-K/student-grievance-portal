import axios from "axios";

const API = axios.create({
  baseURL: "https://0670t6ld-5000.inc1.devtunnels.ms/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
