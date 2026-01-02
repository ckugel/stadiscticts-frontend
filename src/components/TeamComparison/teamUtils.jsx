import { API_BASE_URL, ENDPOINTS } from '../../constants/api';

/**
 * Utility functions for team data operations
 * These functions handle API calls for team information, leagues, years, and search functionality
 */

/**
 * Fetch comprehensive team details including leagues and years
 *
 * When a league is specified, this function makes two API calls:
 * 1. GET /team/{teamName}?league={league} - Gets team data filtered by league
 * 2. GET /team/years/{teamName}/{league} - Gets available years for that team in that league
 *
 * When no league is specified, it gets general team data and extracts years from player data
 *
 * @param {string} teamName - Name of the team to fetch
 * @param {string|null} league - Optional league filter for team-specific data
 * @returns {Promise<Object>} Object containing name, leagues, years, players, and teamEntry
 * @throws {Error} When API calls fail or team is not found
 */
export const fetchTeamDetails = async (teamName, league = null) => {
    try {
        // Construct the main team data URL with optional league parameter
        let url = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(teamName)}`;
        if (league) {
            url += `?league=${encodeURIComponent(league)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch team: ${teamName} (Status: ${res.status})`);
        }

        const teamData = await res.json();

        // Get available leagues for this team (always fetch regardless of league filter)
        const leaguesRes = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/leagues/${encodeURIComponent(teamName)}`);
        let leagues = [];
        if (leaguesRes.ok) {
            leagues = await leaguesRes.json();
        }

        // Get years using the dedicated endpoint if we have a league
        let years = [];
        if (league) {
            try {
                // Use dedicated years endpoint for league-specific years
                const yearsRes = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/years/${encodeURIComponent(teamName)}/${encodeURIComponent(league)}`);
                if (yearsRes.ok) {
                    years = await yearsRes.json();
                }
            } catch (yearError) {
                // Silently fail if years endpoint is unavailable
                years = [];
            }
        } else {
            // If no league specified, extract years from player data as fallback
            const players = teamData.playerEntrys || [];
            years = [...new Set(players.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
        }

        const result = {
            name: teamName,
            leagues,
            years,
            players: teamData.playerEntrys || [],
            teamEntry: teamData
        };

        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch team data for a specific year and league combination
 * Used for getting detailed team statistics for comparison charts
 *
 * @param {string} teamName - Name of the team
 * @param {number} year - Specific year to fetch data for
 * @param {string} league - League to filter by
 * @returns {Promise<Object>} Team data for the specified year and league
 * @throws {Error} When API call fails or data is not found
 */
export const fetchTeamByYearAndLeague = async (teamName, year, league) => {
    try {
        let url = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(teamName)}/${year}`;
        if (league) {
            url += `?league=${encodeURIComponent(league)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch team: ${teamName} for year ${year} and league ${league} (Status: ${res.status})`);
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch available years for a team in a specific league
 * This is a standalone function that uses the dedicated years endpoint
 *
 * @param {string} teamName - Name of the team
 * @param {string} league - League name to get years for
 * @returns {Promise<Array>} Array of available years for the team in that league
 * @throws {Error} When API call fails
 */
export const fetchTeamYears = async (teamName, league) => {
    try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/years/${encodeURIComponent(teamName)}/${encodeURIComponent(league)}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch years for team: ${teamName} in league ${league} (Status: ${res.status})`);
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Get team search suggestions based on user input
 * Returns teams with their associated leagues for the autocomplete dropdown
 *
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of team objects with name and league properties
 */
export const getTeamSuggestions = async (query) => {
    if (query.length <= 1) return [];

    try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`);
        if (res.ok) {
            const data = await res.json();
            return data.teams || [];
        }
    } catch (error) {
        // Return empty array on error to gracefully handle search failures
        return [];
    }
    return [];
};

/**
 * Build a comparison URL with team and league parameters
 * Used for creating shareable links to team comparison pages
 *
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {string|null} league1 - First team's league (optional)
 * @param {string|null} league2 - Second team's league (optional)
 * @returns {string} Complete comparison URL with query parameters
 */
export const buildComparisonUrl = (team1, team2, league1 = null, league2 = null) => {
    const params = new URLSearchParams({
        team1: team1,
        team2: team2
    });

    if (league1) params.set('league1', league1);
    if (league2) params.set('league2', league2);

    return `/compare-teams?${params.toString()}`;
};

/**
 * Unquote text
 */
export const unquote = (str)  => {
    return str.replace(/^\s*['"]|['"]\s*$/g, '');
}
