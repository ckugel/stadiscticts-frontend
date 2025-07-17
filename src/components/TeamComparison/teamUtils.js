import { API_BASE_URL, ENDPOINTS } from '../../constants/api';

/**
 * Utility functions for team data operations
 */

/**
 * Fetch team details including leagues and years
 * @param {string} teamName - Name of the team
 * @param {string} league - Optional league filter
 * @returns {Promise<Object>} Team details with leagues, years, and players
 */
export const fetchTeamDetails = async (teamName, league = null) => {
    try {
        console.log('Fetching team details for:', teamName, 'league:', league); // Debug log

        // Backend expects quoted team names - let the backend handle the quoting
        let url = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(teamName)}`;
        if (league) {
            url += `?league=${league}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch team: ${teamName} (Status: ${res.status})`);
        }

        const teamData = await res.json();

        // Get available leagues for this team
        const leaguesRes = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/leagues/${encodeURIComponent(teamName)}`);
        let leagues = [];
        if (leaguesRes.ok) {
            leagues = await leaguesRes.json();
        }

        // Extract years from player data - use playerEntrys from backend
        const players = teamData.playerEntrys || [];

        // Get all unique years from the players
        const years = [...new Set(players.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);

        const result = {
            name: teamName,
            leagues,
            years,
            players, // This will be playerEntrys from backend
            teamEntry: teamData
        };

        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch team data for a specific year and league
 * @param {string} teamName - Name of the team
 * @param {number} year - Year to fetch
 * @param {string} league - League to fetch
 * @returns {Promise<Object>} Team data for specific year/league
 */
export const fetchTeamByYearAndLeague = async (teamName, year, league) => {
    try {
        let url = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(teamName)}/${year}`;
        if (league) {
            url += `?league=${league}`;
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
 * @param {string} teamName - Name of the team
 * @param {string} league - League name
 * @returns {Promise<Array>} Array of available years
 */
export const fetchTeamYears = async (teamName, league) => {
    try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/years/${encodeURIComponent(teamName)}/${league}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch years for team: ${teamName} in league ${league} (Status: ${res.status})`);
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Get team search suggestions
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of team suggestions
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
        throw error;
    }
    return [];
};

/**
 * Build comparison URL with team and league parameters
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {string} league1 - First team's league (optional)
 * @param {string} league2 - Second team's league (optional)
 * @returns {string} Complete comparison URL
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
