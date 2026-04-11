// frontend/src/services/teams.ts

import { api } from './api'; // Correct instance import axios
import { Team, TeamCreate, TeamUpdate } from '@/types/team'; // Using absolute paths

// Defining the interface for request parameters
interface TeamsQueryParams {
  limit?: number;
  skip?: number;
  search?: string;
}

/**
 * Get a list of all commands with pagination and search capabilities.
 * @param params - Object with parameters skip, limit, search
 */
export const getTeams = async (params: TeamsQueryParams = {}): Promise<Team[]> => {
  try {
    // We pass the parameters directly to axios, he will format them himself
    const response = await api.get<Team[]>('/teams', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch teams');
  }
};

/**
 * Get one command on it ID.
 * @param id - ID teams
 */
export const getTeamById = async (id: number): Promise<Team> => {
  try {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching team ${id}:`, error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch team');
  }
};

/**
 * Create a new team.
 * @param teamData - Data for creating a team
 */
export const createTeam = async (teamData: TeamCreate): Promise<Team> => {
  try {
    const response = await api.post<Team>('/teams', teamData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating team:', error);
    throw new Error(error.response?.data?.detail || 'Failed to create team');
  }
};

/**
 * Update an existing command.
 * @param id - ID commands for updating
 * @param updates - Object with updateable fields
 */
export const updateTeam = async (id: number, updates: TeamUpdate): Promise<Team> => {
  try {
    const response = await api.put<Team>(`/teams/${id}`, updates);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating team ${id}:`, error);
    throw new Error(error.response?.data?.detail || 'Failed to update team');
  }
};

/**
 * Delete a command by its ID.
 * @param id - ID commands to remove
 */
export const deleteTeam = async (id: number): Promise<void> => {
  try {
    await api.delete(`/teams/${id}`);
  } catch (error: any) {
    console.error(`Error deleting team ${id}:`, error);
    throw new Error(error.response?.data?.detail || 'Failed to delete team');
  }
};

/**
 * Get team statistics (example of how you can add other endpoints).
 * @param id - ID teams
 */
export const getTeamStatistics = async (id: number): Promise<any> => {
    try {
      // It is assumed that such an endpoint exists in reports.py
      const response = await api.get(`/reports/team-statistics/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching team ${id} statistics:`, error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch team statistics');
    }
  };

/*
  Note:
  It is better to move the functions that you used for client logic into a folder `frontend/src/utils/`
  or use directly in components. The service layer should only be responsible for communication with API.
  Examples:
  - getTeamsForSelect() -> better implemented in a form component that calls getTeams().
  - checkTeamNameUnique() -> this is business logic that can be part of the form validation.
  - getPlaceColor(), getPlaceDescription() -> this is purely display logic, their place in the component (`TeamsList.tsx`).
*/