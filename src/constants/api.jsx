// API Configuration Constants
// When using proxy in package.json, we don't need the full URL for development
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL || "/api"
    : ""; // Empty string uses the proxy from package.json

// API Endpoints
export const ENDPOINTS = {
  SEARCH: "/search",
  TEAM: "/team",
  PLAYER: "/player",
  GRAPH: "/player/graph",
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, params = "") => {
  return `${API_BASE_URL}${endpoint}${params}`;
};
