import axios from 'axios';

export const api = axios.create({
  baseURL: `/api/tasks`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const Tasks = {
  getAll: () => api.get('/').then(r => r.data),
  get: (id) => api.get(`/${id}`).then(r => r.data),
  add: (payload) => api.post('/', payload).then(r => r.data),
  update: (id, payload) => api.patch(`/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/${id}`).then(r => r.data),
  removeAll: () => api.delete('/').then(r => r.data),
};
