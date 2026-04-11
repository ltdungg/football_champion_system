// frontend/src/services/tickets.ts

import { api } from './api';
import {
  Ticket,
  TicketCreate,
  TicketCalculationRequest,
  TicketCalculationResponse,
  TicketWithMatch,
  TicketCategory
} from '../types/ticket';

// --- Calculation and generation functions ---

/**
 * Calculate the cost of one ticket for a specific category.
 * @param requestData - Data for calculation (ID teams, stadium, category)
 */
export const calculateTicketPrice = async (
  requestData: TicketCalculationRequest
): Promise<TicketCalculationResponse> => {
  const response = await api.post<TicketCalculationResponse>('/tickets/calculate', requestData);
  return response.data;
};

/**
 * Calculate ticket prices for all categories for a specific match.
 * @param home_team_id - ID home team
 * @param away_team_id - ID visiting team
 * @param stadium_id - ID stadium
 */
export const calculateAllCategoriesForMatch = async (
    home_team_id: number,
    away_team_id: number,
    stadium_id: number,
): Promise<Record<string, TicketCalculationResponse>> => {
    const params = new URLSearchParams({
        home_team_id: String(home_team_id),
        away_team_id: String(away_team_id),
        stadium_id: String(stadium_id),
    });
    // match_id V URL - this is a stub, since the real data is transmitted through query-parameters.
    const response = await api.get(`/tickets/calculate/match/0?${params.toString()}`);
    return response.data;
};

/**
 * Create tickets of all categories for a specific match.
 * @param matchId - ID match
 * @param autoCalculatePrices - Flag indicating whether prices should be calculated automatically
 */
export const createTicketsForAllCategories = async (matchId: number, autoCalculatePrices: boolean = true): Promise<Ticket[]> => {
    const response = await api.post<Ticket[]>(`/tickets/match/${matchId}/create-all?auto_calculate_prices=${autoCalculatePrices}`);
    return response.data;
};


// --- CRUD-ticket transactions ---

/**
 * Get a list of all tickets with pagination.
 * @param skip - Number of records to skip
 * @param limit - Maximum number of records to return
 */
export const getTickets = async (skip: number = 0, limit: number = 100): Promise<Ticket[]> => {
  const response = await api.get<Ticket[]>(`/tickets?skip=${skip}&limit=${limit}`);
  return response.data;
};

/**
 * Get a ticket by ID along with match information.
 * @param ticketId - ID tickets
 */
export const getTicketById = async (ticketId: number): Promise<TicketWithMatch> => {
  const response = await api.get<TicketWithMatch>(`/tickets/${ticketId}`);
  return response.data;
};

/**
 * Get all tickets for a specific match.
 * @param matchId - ID match
 */
export const getTicketsByMatch = async (matchId: number): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets/match/${matchId}`);
    return response.data;
};

/**
 * Get all tickets by category.
 * @param category - Ticket category ('VIP', 'Standard', 'Economy')
 */
export const getTicketsByCategory = async (category: TicketCategory): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets/category/${category}`);
    return response.data;
};

/**
 * Get tickets in the specified price range.
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 */
export const getTicketsByPriceRange = async (minPrice: number, maxPrice: number): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets/price-range/?min_price=${minPrice}&max_price=${maxPrice}`);
    return response.data;
};

/**
 * Create a new ticket.
 * @param ticketData - Data for creating a ticket
 */
export const createTicket = async (ticketData: TicketCreate): Promise<Ticket> => {
  const response = await api.post<Ticket>('/tickets', ticketData);
  return response.data;
};

/**
 * Renew ticket.
 * @param ticketId - ID renewal ticket
 * @param ticketData - New ticket information
 */
export const updateTicket = async (ticketId: number, ticketData: TicketCreate): Promise<Ticket> => {
    const response = await api.put<Ticket>(`/tickets/${ticketId}`, ticketData);
    return response.data;
};

/**
 * Delete ticket by ID.
 * @param ticketId - ID the ticket being deleted
 */
export const deleteTicket = async (ticketId: number): Promise<void> => {
    await api.delete(`/tickets/${ticketId}`);
};

/**
 * Delete all tickets for a specific match.
 * @param matchId - ID match
 */
export const deleteTicketsByMatch = async (matchId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/tickets/match/${matchId}`);
    return response.data;
};


// --- Statistics functions ---

/**
 * Get statistics on the number of tickets sold in each category.
 */
export const getTicketStatsByCategory = async (): Promise<Record<string, number>> => {
    const response = await api.get<Record<string, number>>('/tickets/stats/by-category');
    return response.data;
};

/**
 * Get summary statistics on prices (min, max, average).
 */
export const getTicketPriceSummary = async (): Promise<Record<string, number>> => {
    const response = await api.get<Record<string, number>>('/tickets/stats/price-summary');
    return response.data;
};