import axios from 'axios';
import type { QuizCreateData, JoinQuizResponse } from '../types';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },
};

export const roomApi = {
  createRoom: async () => {
    const response = await api.post('/room/create-room');
    return response.data;
  },
};

export const quizApi = {
  createQuiz: async (quizData: QuizCreateData) => {
    const response = await api.post('/quiz/create-quiz', quizData);
    return response.data;
  },

  joinQuiz: async (roomId: string, username: string): Promise<JoinQuizResponse> => {
    const response = await api.post('/quiz/join-quiz', { roomId, username });
    return response.data;
  },
};

export default api;