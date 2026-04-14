import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'
});

// Request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Auth APIs ---
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- Board APIs ---
export const fetchBoards = async () => {
  const response = await api.get('/boards');
  return response.data;
};

export const createBoard = async (boardData) => {
  const response = await api.post('/boards', boardData);
  return response.data;
};

export const updateBoard = async (boardId, boardData) => {
  const response = await api.put(`/boards/${boardId}`, boardData);
  return response.data;
};

// --- Column APIs ---
export const addColumn = async (boardId, columnData) => {
  const response = await api.post(`/boards/${boardId}/columns`, columnData);
  return response.data;
};

// --- Card APIs ---
export const addCard = async (boardId, columnId, cardData) => {
  const response = await api.post(`/boards/${boardId}/columns/${columnId}/cards`, cardData);
  return response.data;
};

export const updateCard = async (boardId, columnId, cardId, cardData) => {
  const response = await api.put(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (boardId, columnId, cardId) => {
  const response = await api.delete(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`);
  return response.data;
};
