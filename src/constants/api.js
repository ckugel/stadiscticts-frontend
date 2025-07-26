// API Configuration Constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// API Endpoints
export const ENDPOINTS = {
  SEARCH: '/search',
  TEAM: '/team',
  PLAYER: '/player',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, params = '') => {
  return `${API_BASE_URL}${endpoint}${params}`;
};