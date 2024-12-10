const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/default-profile.png';

  // Development environment
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:4000${imagePath}`;
  }

  // Production environment
  const API_URL = process.env.REACT_APP_API_URL || 'https://iap-m-api.onrender.com';
  return `${API_URL}${imagePath}`;
};

export { getImageUrl }; 