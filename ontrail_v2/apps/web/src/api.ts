import axios from 'axios';
import type {
  AthleteProfile,
  Comment,
  Exercise,
  ExerciseListItem,
  Group,
  LeaderboardEntry,
  MonthSummary,
  PaginatedResponse,
  PersonalRecord,
  Sport,
  SportSummary,
  TagSummary,
  TagSummaryMonth,
  User,
  UserListItem,
  WeekSummary,
  YearSportSummary,
} from './types';

const BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({ baseURL: BASE, withCredentials: true });

client.interceptors.request.use((cfg) => {
  const raw = localStorage.getItem('ontrail-app');
  if (raw) {
    try {
      const state = JSON.parse(raw);
      const token = state?.state?.token;
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
  }
  return cfg;
});

// Exercises
export const listExercises = (params?: {
  page?: number;
  perPage?: number;
  user?: string;
  sport?: string;
  tag?: string;
  q?: string;
  group?: string;
  minDistM?: number;
  maxDistM?: number;
  minDurSec?: number;
  maxDurSec?: number;
  minHr?: number;
  maxHr?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'distance' | 'duration' | 'hr';
  sortDir?: 'asc' | 'desc';
}) => client.get<PaginatedResponse<ExerciseListItem>>('/exercises', { params }).then((r) => r.data);

export const getExercise = (id: string) =>
  client.get<Exercise>(`/exercises/${id}`).then((r) => r.data);

export const createExercise = (body: Partial<Exercise>) =>
  client.post<Exercise>('/exercises', body).then((r) => r.data);

export const updateExercise = (id: string, body: Partial<Exercise>) =>
  client.patch<Exercise>(`/exercises/${id}`, body).then((r) => r.data);

export const deleteExercise = (id: string) => client.delete(`/exercises/${id}`);

// Comments
export const addComment = (exerciseId: string, body: string) =>
  client.post<Comment>(`/exercises/${exerciseId}/comments`, { body }).then((r) => r.data);

export const deleteComment = (exerciseId: string, commentId: string) =>
  client.delete(`/exercises/${exerciseId}/comments/${commentId}`);

// Cares/kudos
export const addCare = (exerciseId: string) =>
  client.post(`/exercises/${exerciseId}/cares`).then((r) => r.data);

export const removeCare = (exerciseId: string) => client.delete(`/exercises/${exerciseId}/cares`);

// Sports
export const listSports = () =>
  client.get<{ items: Sport[]; total: number }>('/sports').then((r) => r.data.items);

// Users
export const getMe = () => client.get<User>('/me').then((r) => r.data);

export const getUser = (username: string) =>
  client.get<User>(`/users/${username}`).then((r) => r.data);

export const updateProfile = (body: Partial<User>) =>
  client.patch<User>('/me', body).then((r) => r.data);

export const listUsers = (q?: string, page?: number, perPage?: number) =>
  client
    .get<{ items: UserListItem[]; total: number; page: number; perPage: number }>('/users', {
      params: { q, page, perPage },
    })
    .then((r) => r.data);

// Summaries
export const getSportSummary = (username: string) =>
  client.get<{ items: SportSummary[] }>(`/users/${username}/summary`).then((r) => r.data.items);

export const getYearSummary = (username: string, year: number) =>
  client
    .get<{ items: YearSportSummary[] }>(`/users/${username}/summary/${year}`)
    .then((r) => r.data.items);

export const getMonthSummaries = (username: string, year: number) =>
  client
    .get<{ items: MonthSummary[] }>(`/users/${username}/summary/${year}/by/month`)
    .then((r) => r.data.items);

export const getWeekSummaries = (username: string, year: number) =>
  client
    .get<{ items: WeekSummary[] }>(`/users/${username}/summary/${year}/by/week`)
    .then((r) => r.data.items);

export const getAthleteProfile = (username: string) =>
  client.get<AthleteProfile>(`/users/${username}/athlete`).then((r) => r.data);

export const getPersonalRecords = (username: string) =>
  client.get<{ items: PersonalRecord[] }>(`/users/${username}/records`).then((r) => r.data.items);

export const getTagSummary = (username: string) =>
  client.get<{ items: TagSummary[] }>(`/users/${username}/summary/tags`).then((r) => r.data.items);

export const getTagSummaryByYear = (username: string, year: number) =>
  client
    .get<{ items: TagSummary[] }>(`/users/${username}/summary/tags/${year}`)
    .then((r) => r.data.items);

export const getTagSummaryByMonth = (username: string, year: number) =>
  client
    .get<{ items: TagSummaryMonth[] }>(`/users/${username}/summary/tags/${year}/by/month`)
    .then((r) => r.data.items);

export const getLeaderboard = (period: 'month' | 'year', sport?: string) =>
  client
    .get<{ items: LeaderboardEntry[] }>(`/leaderboards/${period}`, {
      params: sport ? { sport } : undefined,
    })
    .then((r) => r.data.items);

// Unread
export const getUnread = () =>
  client.get<{ commentCount: number; exerciseIds: string[] }>('/unread').then((r) => r.data);

export const markAllRead = () => client.post('/unread/mark-all-read').then((r) => r.data);

// Groups
export const listGroups = () =>
  client.get<{ items: Group[]; total: number }>('/groups').then((r) => r.data.items);

export const createGroup = (body: { name: string; description?: string }) =>
  client.post<Group>('/groups', body).then((r) => r.data);

export const joinGroup = (normalizedName: string) =>
  client.post(`/groups/${encodeURIComponent(normalizedName)}/join`).then((r) => r.data);

export const leaveGroup = (normalizedName: string) =>
  client.post(`/groups/${encodeURIComponent(normalizedName)}/leave`).then((r) => r.data);

// Search
export const search = (q: string) =>
  client.get<PaginatedResponse<ExerciseListItem>>('/search', { params: { q } }).then((r) => r.data);

// Export
export const exportData = () => client.get('/export', { responseType: 'blob' }).then((r) => r.data);

export const exportCSV = () =>
  client.get(`/export/csv`, { responseType: 'blob' }).then((r) => r.data);

// Auth (Hanko callback)
export const authCallback = (token: string) =>
  client.post<{ token: string; user: User }>('/auth/callback', { token }).then((r) => r.data);
