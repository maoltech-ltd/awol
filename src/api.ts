import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string || 'http://127.0.0.1:8000/api/',
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV as string || 'http://127.0.0.1:8000/api/',
});

export default api;