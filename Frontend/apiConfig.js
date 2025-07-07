const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '3000') {
    return 'http://localhost:3000';  
  }
  return 'https://broker-ydqv.onrender.com'; 
};

window.API_BASE_URL = getApiBaseUrl();