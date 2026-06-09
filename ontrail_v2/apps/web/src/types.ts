export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  synopsis?: string;
  avatarInitials: string;
  avatarColor: string;
  restHr?: number;
  maxHr?: number;
  createdAt: string;
}

export interface Sport {
  key: string;
  nameFi: string;
  nameEn: string;
  glyph: string;
  color: string;
  metric: 'pace' | 'speed' | 'reps' | 'time';
  paceUnit: 'min/km' | 'km/h' | 'min/100m' | 'min/500m';
}

export interface Comment {
  id: string;
  exerciseId?: string;
  userId?: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  body: string;
  createdAt: string;
  legacyId?: string;
}

export interface Care {
  id: string;
  exerciseId: string;
  authorUsername: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  ownerUsername: string;
  ownerDisplayName: string;
  ownerInitials: string;
  ownerColor: string;
  ownerSynopsis?: string;
  sport: string;
  title: string;
  body?: string;
  gpxPoints?: { lat: number; lon: number; ele?: number }[];
  tags: string[];
  date: string;
  durationSec: number;
  distanceM?: number;
  avgHr?: number;
  feelRating?: 'easy' | 'ok' | 'hard';
  climbM?: number;
  details?: { [key: string]: number };
  comments: Comment[];
  commentCount: number;
  cares: Care[];
  careCount: number;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
  legacyId?: string;
}

export interface ExerciseListItem {
  id: string;
  ownerUsername: string;
  ownerDisplayName: string;
  ownerInitials: string;
  ownerColor: string;
  sport: string;
  title: string;
  tags: string[];
  date: string;
  durationSec: number;
  distanceM?: number;
  avgHr?: number;
  climbM?: number;
  gpxPoints?: { lat: number; lon: number; ele?: number }[];
  commentCount: number;
  careCount: number;
  isNew?: boolean;
}

export interface SportSummary {
  sport: string;
  sessions: number;
  totalDistanceM: number;
  totalDurationSec: number;
  avgHr?: number;
  totalClimbM?: number;
}

export interface YearSummary {
  year: number;
  totalDistanceM: number;
  totalDurationSec: number;
  sessions: number;
  avgPace?: number;
  totalClimbM: number;
  totalKudos: number;
  sports: SportSummary[];
}

export interface MonthSummary {
  year: number;
  month: number;
  totalDistanceM: number;
  totalDurationSec: number;
  sessions: number;
  sports: SportSummary[];
}

export interface WeekSummary {
  year: number;
  week: number;
  totalDistanceM: number;
  totalDurationSec: number;
  sessions: number;
}

export interface Record {
  sport: string;
  distance: string;
  value: string;
  exerciseId: string;
  date: string;
}

export interface Group {
  id: string;
  name: string;
  normalizedName: string;
  description?: string;
  memberCount: number;
  isMember: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
