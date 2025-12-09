import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const hotelAPI = {
  getAllHotels: () => api.get('/api/v1/hotels/'),
  getHotelById: (id) => api.get(`/api/v1/hotels/${id}`),
};

export default api;