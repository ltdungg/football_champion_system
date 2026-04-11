// frontend/src/services/players.ts

import { api } from './api';
import {
  Player,
  PlayerWithTeam,
  PlayerCreate,
  PlayerUpdate,
  PlayerListParams
} from '../types/player';

/**
 * Get a list of players with the ability to filter and paginate.
 * @param params - Object with filtering parameters (skip, limit, team_id etc.)
 */
export const getPlayers = async (params: PlayerListParams = {}): Promise<PlayerWithTeam[]> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await api.get<PlayerWithTeam[]>(`/players?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get detailed information about the player by his ID.
 * @param playerId - ID player
 */
export const getPlayerById = async (playerId: number): Promise<PlayerWithTeam> => {
  const response = await api.get<PlayerWithTeam>(`/players/${playerId}`);
  return response.data;
};

/**
 * Create a new player.
 * @param playerData - Data for creating a player
 */
export const createPlayer = async (playerData: PlayerCreate): Promise<Player> => {
  const response = await api.post<Player>('/players', playerData);
  return response.data;
};

/**
 * Update player information.
 * @param playerId - ID player
 * @param playerData - Data to update
 */
export const updatePlayer = async (playerId: number, playerData: PlayerUpdate): Promise<Player> => {
  const response = await api.put<Player>(`/players/${playerId}`, playerData);
  return response.data;
};

/**
 * Remove player.
 * @param playerId - ID player
 */
export const deletePlayer = async (playerId: number): Promise<{ message: string }> => {
  const response = await api.delete(`/players/${playerId}`);
  return response.data;
};

/**
 * Get players in the specified age range.
 * @param minAge - Minimum age
 * @param maxAge - Maximum age
 */
export const getPlayersByAgeRange = async (minAge: number, maxAge: number): Promise<PlayerWithTeam[]> => {
    const response = await api.get<PlayerWithTeam[]>(`/players/age-range/?min_age=${minAge}&max_age=${maxAge}`);
    return response.data;
};

/**
 * Transfer a player to another team.
 * @param playerId - ID player
 * @param newTeamId - ID new team
 */
export const transferPlayer = async (playerId: number, newTeamId: number): Promise<{ message: string; player: Player }> => {
    const response = await api.post(`/players/${playerId}/transfer?new_team_id=${newTeamId}`);
    return response.data;
};