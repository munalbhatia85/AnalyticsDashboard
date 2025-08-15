/**
 * API Configuration
 * 
 * Centralized axios instance for API calls with base configuration
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure backend is running here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;