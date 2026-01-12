/**
 * Validates required environment variables
 * Throws error if any required variables are missing
 */

export const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = [];

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }

  // Optional: Validate format
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
    console.warn('Warning: MONGO_URI should start with "mongodb://" or "mongodb+srv://"');
  }
};
