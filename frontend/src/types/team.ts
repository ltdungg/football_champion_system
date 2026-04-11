// frontend/src/types/team.ts

/**
 * The main interface for the command, received from the backend.
 * Matches the diagram `Team` V Pydantic.
 */
export interface Team {
  id: number;
  name: string;
  city: string;
  coach: string;
  last_season_place: number;
  created_at: string; // Dates from API come as strings in the format ISO
  updated_at: string;
}

/**
 * Interface for creating a new team.
 * Matches the diagram `TeamCreate` V Pydantic.
 */
export interface TeamCreate {
  name: string;
  city: string;
  coach: string;
  last_season_place: number;
}

/**
 * Interface for updating an existing command.
 * Fields are optional, corresponds to the scheme `TeamUpdate` V Pydantic.
 */
export interface TeamUpdate {
  name?: string;
  city?: string;
  coach?: string;
  last_season_place?: number;
}