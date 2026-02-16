/**
 * Environment configuration
 * Use --ai flag or set USE_COPILOT=true to enable AI features
 */

// Dynamic getters to check environment at runtime
export const config = {
  get USE_COPILOT() {
    return process.env.USE_COPILOT === 'true';
  },
  
  // Environment
  get IS_DEV() {
    return process.env.NODE_ENV !== 'production';
  },
  get IS_PROD() {
    return process.env.NODE_ENV === 'production';
  }
};

// For development: Copilot is opt-in via flag or env var
// For production: Same behavior
export const shouldUseCopilot = (): boolean => {
  return process.env.USE_COPILOT === 'true';
};