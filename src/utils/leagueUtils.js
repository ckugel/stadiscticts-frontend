// League name mapping from backend values to display-friendly names
export const leagueDisplayNames = {
  MENS_COLLEGE: "Men's College",
  WOMENS_COLLEGE: "Women's College",
  MIXED_CLUB: "Mixed Club",
  MENS_CLUB: "Men's Club",
  WOMENS_CLUB: "Women's Club",
  OTHER: "Other",
};

/**
 * Convert a backend league name to a display-friendly name
 * @param {string} backendLeagueName - The league name from the backend
 * @returns {string} - The display-friendly league name
 */
export const getLeagueDisplayName = (leagueName) => {
  return leagueDisplayNames[leagueName] || leagueName;
};

/**
 * Convert a backend league name to a display-friendly name (alias for consistency)
 * @param {string} backendLeagueName - The league name from the backend
 * @returns {string} - The display-friendly league name
 */
export const getDisplayLeagueName = (leagueName) => {
  return leagueDisplayNames[leagueName] || leagueName;
};

/**
 * Convert multiple backend league names to display-friendly names
 * @param {string[]} backendLeagueNames - Array of league names from the backend
 * @returns {string[]} - Array of display-friendly league names
 */
export const getDisplayLeagueNames = (backendLeagueNames) => {
  return backendLeagueNames.map(getDisplayLeagueName);
};
