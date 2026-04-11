// frontend/src/types/ticket.ts
import { MatchWithDetails } from './match';

/**
 * Ticket categories.
 */
export type TicketCategory = 'VIP' | 'Standard' | 'Economy';

/**
 * Interface for requesting ticket cost calculation.
 * Matches the diagram `TicketCalculationRequest` V Pydantic.
 */
export interface TicketCalculationRequest {
  home_team_id: number;
  away_team_id: number;
  stadium_id: number;
  category: TicketCategory;
}

/**
 * Interface for replying with ticket cost calculation.
 * Matches the diagram `TicketCalculationResponse` V Pydantic.
 */
export interface TicketCalculationResponse {
  category: TicketCategory;
  price: number;
  base_price: number;
  prestige_coefficient: number;
  category_multiplier: number;
}

/**
 * Main ticket interface.
 * Matches the diagram `Ticket` V Pydantic.
 */
export interface Ticket {
  id: number;
  match_id: number;
  category: TicketCategory;
  price: number;
  created_at: string;
  updated_at: string;
}

/**
 * Ticket interface with detailed information about the match.
 * Matches the diagram `TicketWithMatch` V Pydantic.
 */
export interface TicketWithMatch extends Ticket {
  match: MatchWithDetails;
}

/**
 * Interface for creating a new ticket.
 * Matches the diagram `TicketCreate` V Pydantic.
 */
export interface TicketCreate {
  match_id: number;
  category: TicketCategory;
  price: number;
}