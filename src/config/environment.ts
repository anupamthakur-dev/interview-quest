/**
 * Environment configuration
 * Set USE_COPILOT to false for development to save costs
 */

export const config = {
  // Set to false to use question bank instead of Copilot
  USE_COPILOT: process.env.USE_COPILOT === 'true' || false,
  
  // Environment
  IS_DEV: process.env.NODE_ENV !== 'production',
  IS_PROD: process.env.NODE_ENV === 'production'
};

// For development: disable Copilot by default
// For production: enable Copilot
export const shouldUseCopilot = (): boolean => {
  return config.USE_COPILOT && !config.IS_DEV;
};