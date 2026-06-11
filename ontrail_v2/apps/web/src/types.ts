export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  synopsis?: string;
  avatarInitials: string;
  avatarColor: string;
  gravatarHash?: string;
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
  gravatarHash?: string;
  body: string;
  createdAt: string;
  legacyId?: string;
}

export interface Care {
  authorId: string;
  authorUsername: string;
  avatarInitials: string;
  avatarColor: string;
  gravatarHash?: string;
  emoji: string;
}

export interface Exercise {
  id: string;
  ownerUsername: string;
  ownerDisplayName: string;
  ownerInitials: string;
  ownerColor: string;
  ownerGravatarHash?: string;
  ownerSynopsis?: string;
  sport: string;
  title: string;
  body?: string;
  gpxPoints?: { lat: number; lon: number; ele?: number }[];
  tags: string[];
  date: string;
  durationCs: number;
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
  ownerGravatarHash?: string;
  sport: string;
  title: string;
  body?: string;
  tags: string[];
  date: string;
  durationCs: number;
  distanceM?: number;
  avgHr?: number;
  climbM?: number;
  gpxPoints?: { lat: number; lon: number; ele?: number }[];
  commentCount: number;
  careCount: number;
  cares: Care[];
  isNew?: boolean;
}

export interface SportSummary {
  sport: string;
  sessionCount: number;
  totalDistanceM: number;
  totalDurationCs: number;
  totalClimbM: number;
  totalKcal: number;
  avgHr?: number;
  bestDurationCs?: number;
  bestDistanceM?: number;
  firstDate?: string;
  lastDate?: string;
}

export interface YearSportSummary {
  year: number;
  sport: string;
  sessionCount: number;
  totalDistanceM: number;
  totalDurationCs: number;
  totalClimbM: number;
  totalKcal: number;
  avgHr?: number;
  bestDurationCs?: number;
  bestDistanceM?: number;
  firstDate?: string;
  lastDate?: string;
}

export interface MonthSummary {
  year: number;
  month: number;
  sport: string;
  sessionCount: number;
  totalDistanceM: number;
  totalDurationCs: number;
  totalClimbM: number;
  avgHr?: number;
}

export interface WeekSummary {
  year: number;
  week: number;
  sport: string;
  sessionCount: number;
  totalDistanceM: number;
  totalDurationCs: number;
  totalClimbM: number;
  avgHr?: number;
}

export interface AthleteProfile {
  userId: string;
  username: string;
  displayName: string;
  restHr?: number;
  maxHr?: number;
  aerk?: number;
  anaerk?: number;
  zone2LowerBpm?: number;
  zone4LowerBpm?: number;
  totalSessions: number;
  careerDurationCs: number;
  careerDistanceM: number;
  careerClimbM: number;
  careerKcal: number;
  firstExerciseDate?: string;
  lastExerciseDate?: string;
  firstYear?: number;
  lastYear?: number;
  activeWeeks: number;
  primarySport?: string;
  sessions30d: number;
  sessions90d: number;
  sessions365d: number;
  durationCs30d: number;
  durationCs90d: number;
}

export interface PersonalRecord {
  sport: string;
  bestDurationCs?: number;
  bestDurationExerciseId?: string;
  bestDistanceM?: number;
  bestDistanceExerciseId?: string;
  bestPace?: number;
  bestPaceExerciseId?: string;
  peakAvgHr?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  sessionCount: number;
  totalDurationCs: number;
  totalDistanceM: number;
}

export interface TagSummary {
  tag: string;
  sessionCount: number;
  totalDurationCs: number;
  totalDistanceM: number;
  totalClimbM: number;
  avgHr?: number;
  firstDate?: string;
  lastDate?: string;
}

export interface TagSummaryMonth {
  year: number;
  month: number;
  tag: string;
  sessionCount: number;
  totalDurationCs: number;
  totalDistanceM: number;
  totalClimbM: number;
  avgHr?: number;
}

export interface UserListItem {
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  synopsis?: string;
  exerciseCount: number;
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
