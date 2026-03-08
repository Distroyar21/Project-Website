const API_BASE_URL = 'http://localhost:5000/api';

export const fetchApod = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/nasa/apod`);
    if (!response.ok) throw new Error('NASA APOD error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching APOD:', error);
    return null;
  }
};

export const fetchNasaImages = async (query = 'astronomy', page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nasa/images?q=${query}&page=${page}`);
    if (!response.ok) throw new Error('NASA API error');
    const data = await response.json();
    return data.collection.items;
  } catch (error) {
    console.error('Error fetching NASA images:', error);
    return [];
  }
};

export const fetchNasaNews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/nasa/images?q=mission&media_type=image&year_start=2024`);
    if (!response.ok) throw new Error('NASA News error');
    const data = await response.json();
    return data.collection.items.slice(0, 10);
  } catch (error) {
    console.error('Error fetching NASA news:', error);
    return [];
  }
};

export const fetchYoutubeVideos = async (query = 'astronomy exploration') => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/videos?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('YouTube API error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [
      { id: 'dQw4w9WgXcQ', title: 'The Universe in 4K', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg' },
      { id: 'libKVRa01L8', title: 'NASA Webb Telescope First Images', thumbnail: 'https://img.youtube.com/vi/libKVRa01L8/0.jpg' },
      { id: 'uD4izufzhbs', title: 'Journey to the Edge of the Universe', thumbnail: 'https://img.youtube.com/vi/uD4izufzhbs/0.jpg' },
      { id: 'GoW8Tf7hGu8', title: 'Black Holes Explained', thumbnail: 'https://img.youtube.com/vi/GoW8Tf7hGu8/0.jpg' },
    ];
  }
};

// --- AUTH SERVICES ---

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

export const googleLogin = async (credential) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential })
  });
  return await response.json();
};
