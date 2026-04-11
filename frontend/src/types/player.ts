// frontend/src/types/player.ts
import { Team } from './team';

/**
 * Player positions used on the backend.
 */
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

/**
 * Basic player interface.
 */
export interface Player {
  id: number;
  team_id: number;
  first_name: string;
  last_name: string;
  age: number;
  jersey_number: number;
  position: PlayerPosition;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for the player with detailed information about the team.
 * Matches the diagram `PlayerWithTeam` V Pydantic.
 */
export interface PlayerWithTeam extends Player {
  team: Team;
}

/**
 * Interface for creating a new player.
 * Matches the diagram `PlayerCreate` V Pydantic.
 */
export interface PlayerCreate {
  first_name: string;
  last_name: string;
  age: number;
  jersey_number: number;
  position: PlayerPosition;
  team_id: number;
}

/**
 * Interface for updating an existing player.
 * Fields are optional, corresponds to the scheme `PlayerUpdate` V Pydantic.
 */
export interface PlayerUpdate {
  first_name?: string;
  last_name?: string;
  age?: number;
  jersey_number?: number;
  position?: PlayerPosition;
  team_id?: number;
}

/**
 * Interface for player list filtering options.
 */
export interface PlayerListParams {
    skip?: number;
    limit?: number;
    team_id?: number;
    position?: PlayerPosition;
    search?: string;
}