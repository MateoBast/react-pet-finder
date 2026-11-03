import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Cambia esto por tu URL

export const getPets = () => axios.get(`${API_URL}/api/pets`);
export const createUser = (userData) => axios.post(`${API_URL}/api/users`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}/api/login`, credentials);
export const requestPasswordReset = (data) => axios.post(`${API_URL}/api/request-password-reset`, data); // Nueva función
