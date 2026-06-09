import axios from 'axios';
import type {
  Exercise, ExerciseListItem, Comment, User,
  YearSummary, MonthSummary, WeekSummary, Group, PaginatedResponse,
} from './types';

// In dev, Vite proxies /api → localhost:3001. In prod, set VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({ baseURL: BASE, withCredentials: true });

client.interceptors.request.use((cfg) => {
  const raw = localStorage.getItem('ontrail-app');
  if (raw) {
    try {
      const state = JSON.parse(raw);
      const token = state?.state?.token;
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
    } catch { /* ignore */ }
  }
  return cfg;
});

// Exercises
export const listExercises = (params?: {
  page?: number; perPage?: number; user?: string; sport?: string; tag?: string; q?: string;
}) => client.get<PaginatedResponse<ExerciseListItem>>('/exercises', { params }).then(r => r.data);

export const getExercise = (id: string) =>
  client.get<Exercise>(`/exercises/${id}`).then(r => r.data);

export const createExercise = (body: Partial<Exercise>) =>
  client.post<Exercise>('/exercises', body).then(r => r.data);

export const updateExercise = (id: string, body: Partial<Exercise>) =>
  client.patch<Exercise>(`/exercises/${id}`, body).then(r => r.data);

export const deleteExercise = (id: string) =>
  client.delete(`/exercises/${id}`);

// Comments
export const addComment = (exerciseId: string, body: string) =>
  client.post<Comment>(`/exercises/${exerciseId}/comments`, { body }).then(r => r.data);

export const deleteComment = (exerciseId: string, commentId: string) =>
  client.delete(`/exercises/${exerciseId}/comments/${commentId}`);

// Cares/kudos
export const addCare = (exerciseId: string) =>
  client.post(`/exercises/${exerciseId}/cares`).then(r => r.data);

export const removeCare = (exerciseId: string) =>
  client.delete(`/exercises/${exerciseId}/cares`);

// Users
export const getMe = () => client.get<User>('/me').then(r => r.data);

export const getUser = (username: string) =>
  client.get<User>(`/users/${username}`).then(r => r.data);

export const updateProfile = (body: Partial<User>) =>
  client.patch<User>('/me', body).then(r => r.data);

// Summaries
export const getYearSummary = (_username: string, year: number) =>
  client.get<YearSummary>(`/summaries/year/${year}`).then(r => r.data);

export const getMonthSummaries = (_username: string, _year: number) =>
  client.get<MonthSummary[]>(`/summaries/months`).then(r => r.data);

export const getWeekSummaries = (_username: string, _year: number) =>
  client.get<WeekSummary[]>(`/summaries/weeks`).then(r => r.data);

// Groups
export const listGroups = () => client.get<{ items: Group[]; total: number }>('/groups').then(r => r.data.items);

export const joinGroup = (id: string) =>
  client.post(`/groups/${encodeURIComponent(id)}/members`).then(r => r.data);

export const leaveGroup = (id: string) =>
  client.delete(`/groups/${encodeURIComponent(id)}/members`).then(r => r.data);

// Search
export const search = (q: string) =>
  client.get<PaginatedResponse<ExerciseListItem>>('/search', { params: { q } }).then(r => r.data);

// Export
export const exportCSV = () =>
  client.get(`/export/csv`, { responseType: 'blob' }).then(r => r.data);

// Auth (Hanko callback)
export const authCallback = (token: string) =>
  client.post<{ token: string; user: User }>('/auth/callback', { token }).then(r => r.data);
