// frontend/src/services/reports.ts

import { api } from './api';
import {
  TournamentTable,
  MatchStatistics,
  TeamStatistics,
  TopScorer,
  GeneralStatistics,
  SeasonSummary,
  HeadToHeadAnalysis,
  TeamComparisonReport
} from '../types/report';

/**
 * Get the latest standings.
 */
export const getTournamentStandings = async (): Promise<TournamentTable> => {
  const response = await api.get<TournamentTable>('/reports/standings');
  return response.data;
};

/**
 * Get general match statistics.
 */
export const getMatchStatistics = async (): Promise<MatchStatistics> => {
  const response = await api.get<MatchStatistics>('/reports/match-statistics');
  return response.data;
};

/**
 * Get detailed statistics for a specific team.
 * @param teamId - ID teams
 */
export const getTeamStatistics = async (teamId: number): Promise<TeamStatistics> => {
  const response = await api.get<TeamStatistics>(`/reports/team-statistics/${teamId}`);
  return response.data;
};

/**
 * Get a list of the most successful teams.
 * @param limit - Number of commands to return (default 5)
 */
export const getTopScoringTeams = async (limit: number = 5): Promise<TopScorer[]> => {
  const response = await api.get<TopScorer[]>(`/reports/top-scorers?limit=${limit}`);
  return response.data;
};

/**
 * Get general tournament statistics.
 */
export const getGeneralStatistics = async (): Promise<GeneralStatistics> => {
  const response = await api.get<GeneralStatistics>('/reports/general-statistics');
  return response.data;
};

/**
 * Get the full season report.
 */
export const getSeasonSummary = async (): Promise<SeasonSummary> => {
  const response = await api.get<SeasonSummary>('/reports/season-summary');
  return response.data;
};

/**
 * Get an analysis of head-to-head matches between two teams.
 * @param team1Id - ID first team
 * @param team2Id - ID second team
 */
export const getHeadToHeadAnalysis = async (team1Id: number, team2Id: number): Promise<HeadToHeadAnalysis> => {
    const response = await api.get<HeadToHeadAnalysis>(`/reports/head-to-head/${team1Id}/${team2Id}`);
    return response.data;
}

/**
 * Compare the statistics of two teams.
 * @param team1Id - ID first team
 * @param team2Id - ID second team
 */
export const getTeamComparison = async (team1Id: number, team2Id: number): Promise<TeamComparisonReport> => {
    const response = await api.get<TeamComparisonReport>(`/reports/team-comparison/${team1Id}/${team2Id}`);
    return response.data;
}