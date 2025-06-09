import axios from 'axios';

const API = axios.create({
  baseURL: 'https://budget-track-full-stack.onrender.com/api',
});

// const API = axios.create({
//   baseURL: 'http://localhost:8000/api',
// });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;