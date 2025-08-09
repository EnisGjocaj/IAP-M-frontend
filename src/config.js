
const config = {
  development: {
    API_URL: 'http://localhost:4000',
  },
  production: {
    API_URL: 'https://api.iap-m.com', 
  },
};

const currentConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

export default currentConfig;

