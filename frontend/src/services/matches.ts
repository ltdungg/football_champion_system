// frontend/src/services/matches.ts

import { api } from './api';
import { MatchWithDetails, MatchCreate, MatchUpdate, MatchResult } from '../types/match';

/**
 * Get a list of all matches with pagination.
 * @param skip - Number of records to skip
 * @param limit - Maximum number of records to return
 */
export const getMatches = async (skip: number = 0, limit: number = 100): Promise<MatchWithDetails[]> => {
  const response = await api.get<MatchWithDetails[]>(`/matches?skip=${skip}&limit=${limit}`);
  return response.data;
};

/**
 * Get a list of upcoming matches.
 * @param limit - Maximum number of matches to be refunded
 */
export const getUpcomingMatches = async (limit: number = 10): Promise<MatchWithDetails[]> => {
  const response = await api.get<MatchWithDetails[]>(`/matches/upcoming?limit=${limit}`);
  return response.data;
};

/**
 * Get a list of completed matches.
 */
export const getFinishedMatches = async (): Promise<MatchWithDetails[]> => {
  const response = await api.get<MatchWithDetails[]>('/matches/finished');
  return response.data;
};

/**
 * Get matches for a specific team.
 * @param teamId - ID teams
 */
export const getMatchesByTeam = async (teamId: number): Promise<MatchWithDetails[]> => {
  const response = await api.get<MatchWithDetails[]>(`/matches/team/${teamId}`);
  return response.data;
};

/**
 * Get head-to-head matches between two teams.
 * @param team1Id - ID first team
 * @param team2Id - ID second team
 */
export const getHeadToHeadMatches = async (team1Id: number, team2Id: number): Promise<MatchWithDetails[]> => {
  const response = await api.get<MatchWithDetails[]>(`/matches/head-to-head/${team1Id}/${team2Id}`);
  return response.data;
};

/**
 * Get detailed information about the match by its ID.
 * @param matchId - ID match
 */
export const getMatchById = async (matchId: number): Promise<MatchWithDetails> => {
  const response = await api.get<MatchWithDetails>(`/matches/${matchId}`);
  return response.data;
};

/**
 * Create a new match.
 * @param matchData - Data for creating a match
 */
export const createMatch = async (matchData: MatchCreate): Promise<MatchWithDetails> => {
  const response = await api.post<MatchWithDetails>('/matches', matchData);
  return response.data;
};

/**
 * Update match information.
 * @param matchId - ID match
 * @param matchData - Data to update
 */
export const updateMatch = async (matchId: number, matchData: MatchUpdate): Promise<MatchWithDetails> => {
  const response = await api.put<MatchWithDetails>(`/matches/${matchId}`, matchData);
  return response.data;
};

/**
 * Set match result.
 * @param matchId - ID match
 * @param result - Object with results (goals)
 */
export const setMatchResult = async (matchId: number, result: MatchResult): Promise<MatchWithDetails> => {
  const response = await api.put<MatchWithDetails>(`/matches/${matchId}/result`, result);
  return response.data;
};

/**
 * Cancel match.
 * @param matchId - ID match
 */
export const cancelMatch = async (matchId: number): Promise<MatchWithDetails> => {
    const response = await api.put<MatchWithDetails>(`/matches/${matchId}/cancel`);
    return response.data;
}

/**
 * Delete match.
 * @param matchId - ID match
 */
export const deleteMatch = async (matchId: number): Promise<void> => {
  await api.delete(`/matches/${matchId}`);
};