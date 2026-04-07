import axios from 'axios';
import type { Inscription, InscriptionFormData, CategoryInfo, Stats, LoginResponse, HomeContent } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Inscription services
export const inscriptionService = {
  create: async (data: InscriptionFormData) => {
    const response = await api.post('/inscriptions', data);
    return response.data;
  },
  
  getAll: async (): Promise<Inscription[]> => {
    const response = await api.get('/inscriptions');
    return response.data;
  },
  
  getByCategory: async (): Promise<CategoryInfo[]> => {
    const response = await api.get('/inscriptions/by-category');
    return response.data;
  },
  
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/inscriptions/stats');
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/inscriptions/${id}`);
    return response.data;
  },
};

export const siteContentService = {
  getHomeContent: async (): Promise<HomeContent> => {
    const response = await api.get('/site-content/home');
    return response.data;
  },

  updateHomeContent: async (data: HomeContent): Promise<HomeContent> => {
    const response = await api.put('/site-content/home', data);
    return response.data.content;
  },
};

export default api;
