// frontend/src/types/match.ts
import { Stadium } from '@/types/stadium';
import { Team } from '@/types/team';

/**
 * Match status.
 */
export type MatchStatus = 'scheduled' | 'finished' | 'cancelled';

/**
 * Main interface for the match with detailed information
 * about the teams and the stadium. Matches the diagram `MatchWithDetails` V Pydantic.
 */
export interface MatchWithDetails {
  id: number;
  date: string; // Dates from API come as strings in the format ISO
  home_team_id: number;
  away_team_id: number;
  stadium_id: number;
  home_goals: number | null;
  away_goals: number | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
  home_team: Team;
  away_team: Team;
  stadium: Stadium;
}

/**
 * Interface for creating a new match.
 * Matches the diagram `MatchCreate` V Pydantic.
 */
export interface MatchCreate {
  date: string; // YYYY-MM-DDTHH:MM:SS
  home_team_id: number;
  away_team_id: number;
  stadium_id: number;
}

/**
 * Interface for updating an existing match.
 * Fields are optional, corresponds to the scheme `MatchUpdate` V Pydantic.
 */
export interface MatchUpdate {
  date?: string;
  home_team_id?: number;
  away_team_id?: number;
  stadium_id?: number;
  home_goals?: number;
  away_goals?: number;
  status?: MatchStatus;
}

/**
 * Interface for setting the match result.
 * Matches the diagram `MatchResult` V Pydantic.
 */
export interface MatchResult {
  home_goals: number;
  away_goals: number;
}