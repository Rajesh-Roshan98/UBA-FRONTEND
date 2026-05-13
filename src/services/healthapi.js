import axios from "axios";

const healthApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
});

export default healthApi;
