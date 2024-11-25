// Configuration for different environments
const config = {
  development: {
    API_URL: 'http://localhost:4000',
  },
  production: {
    API_URL: 'https://iap-m-api.onrender.com', // Change this to your new hosting server URL
  },
};

// Use production config if NODE_ENV is production, otherwise use development
const currentConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

export default currentConfig;
