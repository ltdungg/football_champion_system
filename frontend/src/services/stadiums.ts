// frontend/src/services/stadiums.ts

import { api } from './api';
import { Stadium, StadiumCreate, StadiumUpdate, StadiumListParams, StadiumStatistics } from '../types/stadium';

/**
 * Get a list of stadiums with the ability to filter and paginate.
 * @param params - Object with filtering parameters (skip, limit, search etc.)
 */
export const getStadiums = async (params: StadiumListParams = {}): Promise<Stadium[]> => {
  // Create query parameters, removing all empty values
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await api.get<Stadium[]>(`/stadiums?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get detailed information about the stadium by its ID.
 * @param stadiumId - ID stadium
 */
export const getStadiumById = async (stadiumId: number): Promise<Stadium> => {
  const response = await api.get<Stadium>(`/stadiums/${stadiumId}`);
  return response.data;
};

/**
 * Create a new stadium.
 * @param stadiumData - Data for creating a stadium
 */
export const createStadium = async (stadiumData: StadiumCreate): Promise<Stadium> => {
  const response = await api.post<Stadium>('/stadiums', stadiumData);
  return response.data;
};

/**
 * Update stadium information.
 * @param stadiumId - ID stadium
 * @param stadiumData - Data to update
 */
export const updateStadium = async (stadiumId: number, stadiumData: StadiumUpdate): Promise<Stadium> => {
  const response = await api.put<Stadium>(`/stadiums/${stadiumId}`, stadiumData);
  return response.data;
};

/**
 * Delete stadium.
 * @param stadiumId - ID stadium
 */
export const deleteStadium = async (stadiumId: number): Promise<void> => {
  await api.delete(`/stadiums/${stadiumId}`);
};

/**
 * Get statistics for a specific stadium.
 * @param stadiumId - ID stadium
 */
export const getStadiumStatistics = async (stadiumId: number): Promise<StadiumStatistics> => {
  const response = await api.get<StadiumStatistics>(`/stadiums/${stadiumId}/statistics`);
  return response.data;
};

/**
 * Get a list of all cities that have stadiums.
 */
export const getStadiumCities = async (): Promise<string[]> => {
  const response = await api.get<{ cities: string[] }>('/stadiums/cities/list');
  return response.data.cities;
};

/**
 * Get a list of stadiums available on a specific date.
 * @param date - Date in format ISO (YYYY-MM-DDTHH:MM:SS)
 */
export const getAvailableStadiums = async (date: string): Promise<Stadium[]> => {
    const response = await api.get<Stadium[]>(`/stadiums/available/${date}`);
    return response.data;
}