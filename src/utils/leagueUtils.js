// League name mapping from backend values to display-friendly names
export const leagueDisplayNames = {
  MENS_COLLEGE_D1: "Men's College D1",
  MENS_COLLEGE_D3: "Men's College D3",
  WOMENS_COLLEGE_D1: "Women's College D1",
  WOMENS_COLLEGE_D3: "Women's College D3",
  MIXED_CLUB: "Mixed Club",
  MENS_CLUB: "Men's Club",
  WOMENS_CLUB: "Women's Club",
  WOMENS_YCC_U17: "Women's YCC U17",
  OTHER: "Other",
  MENS_YCC_U20: "Men's YCC U20",
  WOMENS_YCC_U20: "Women's YCC U20",
  MIXED_YCC_U20: "Mixed YCC U20",
  MIXED_YCC_U17: "Mixed YCC U17",
  MENS_YCC_U17: "Men's YCC U17"
};

/**
 * Convert a backend league name to a display-friendly name
 * @param {string} backendLeagueName - The league name from the backend
 * @returns {string} - The display-friendly league name
 */
export const getDisplayLeagueName = (backendLeagueName) => {
  return leagueDisplayNames[backendLeagueName] || backendLeagueName;
};

/**
 * Convert multiple backend league names to display-friendly names
 * @param {string[]} backendLeagueNames - Array of league names from the backend
 * @returns {string[]} - Array of display-friendly league names
 */
export const getDisplayLeagueNames = (backendLeagueNames) => {
  return backendLeagueNames.map(getDisplayLeagueName);
};
