// frontend/src/types/report.ts

/**
 * Interface for one line in the standings.
 * Matches the diagram `TeamStanding` V Pydantic.
 */
export interface TeamStanding {
  position: number;
  team_id: number;
  team_name: string;
  team_city: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
}

/**
 * Interface for the entire standings.
 * Matches the diagram `TournamentTable` V Pydantic.
 */
export interface TournamentTable {
  standings: TeamStanding[];
  last_updated: string; // Dates from API come as strings in the format ISO
}

/**
 * Interface for match statistics.
 * Matches the diagram `MatchStatistics` V Pydantic.
 */
export interface MatchStatistics {
  total_matches: number;
  finished_matches: number;
  scheduled_matches: number;
  cancelled_matches: number;
  total_goals: number;
  average_goals_per_match: number;
  highest_scoring_match: Record<string, any> | null;
}

/**
 * Interface for team statistics.
 * Matches the diagram `TeamStatistics` V Pydantic.
 */
export interface TeamStatistics {
  team_id: number;
  team_name: string;
  home_matches: number;
  away_matches: number;
  home_wins: number;
  away_wins: number;
  home_draws: number;
  away_draws: number;
  home_losses: number;
  away_losses: number;
  home_goals_scored: number;
  away_goals_scored: number;
  home_goals_conceded: number;
  away_goals_conceded: number;
  current_form: ('W' | 'D' | 'L')[];
}

/**
 * Interface for the most productive teams.
 * Matches the diagram `TopScorer` V Pydantic.
 */
export interface TopScorer {
  team_id: number;
  team_name: string;
  total_goals: number;
  matches_played: number;
  goals_per_match: number;
}

/**
 * Interface for general tournament statistics.
 * Matches the diagram `GeneralStatistics` V Pydantic.
 */
export interface GeneralStatistics {
  total_teams: number;
  total_matches: number;
  finished_matches: number;
  total_goals: number;
  average_goals_per_match: number;
  top_scoring_teams: TopScorer[];
  match_statistics: MatchStatistics;
}

/**
 * Interface for reporting on the entire season.
 * Matches the diagram `SeasonSummary` V Pydantic.
 */
export interface SeasonSummary {
  tournament_table: TournamentTable;
  general_statistics: GeneralStatistics;
  generated_at: string;
}

/**
 * Interface for analyzing face-to-face meetings.
 */
export interface HeadToHeadAnalysis {
  total_matches: number;
  team1_wins: number;
  team2_wins: number;
  draws: number;
  team1_goals: number;
  team2_goals: number;
}

/**
 * Interface for comparing two commands.
 */
export interface TeamComparisonReport {
    team1_stats: TeamStatistics;
    team2_stats: TeamStatistics;
}