const API_BASE_URL = 'http://localhost:5007/api';

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

export const fetchNasaImages = async (query = 'astronomy', page = 1, options = {}) => {
  try {
    const { mediaType, yearStart, yearEnd } = options;
    let url = `${API_BASE_URL}/nasa/images?q=${query}&page=${page}`;
    
    if (mediaType) url += `&media_type=${mediaType}`;
    if (yearStart) url += `&year_start=${yearStart}`;
    if (yearEnd) url += `&year_end=${yearEnd}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('NASA API error');
    const data = await response.json();
    return data.collection.items;
  } catch (error) {
    console.error('Error fetching NASA images:', error);
    return [];
  }
};

export const refineSearch = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/refine-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!response.ok) throw new Error('AI Refine error');
    return await response.json();
  } catch (error) {
    console.error('Error refining search:', error);
    return null;
  }
};

export const fetchNasaAsset = async (nasaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nasa/asset/${nasaId}`);
    if (!response.ok) throw new Error('NASA Asset error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching NASA asset:', error);
    return null;
  }
};


let newsCache = null;

export const fetchNasaNews = async () => {
  if (newsCache) return newsCache;
  
  try {
    const response = await fetch(`${API_BASE_URL}/news/latest`);
    if (!response.ok) throw new Error('NASA News error');
    const data = await response.json();
    newsCache = data;
    return newsCache;
  } catch (error) {
    console.error('Error fetching NASA news:', error);
    return [];
  }
};


let videoCache = {};

export const fetchYoutubeVideos = async (query = 'astronomy exploration', lang = 'en') => {
  const cacheKey = `${query}_${lang}`;
  if (videoCache[cacheKey]) return videoCache[cacheKey];

  try {
    const response = await fetch(`${API_BASE_URL}/youtube/videos?q=${encodeURIComponent(query)}&lang=${lang}`);
    if (!response.ok) throw new Error('YouTube API error');
    const data = await response.json();
    videoCache[cacheKey] = data;
    return data;
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

export const analyzeNews = async (text) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('AI Analysis error');
    return await response.json();
  } catch (error) {
    console.error('Error analyzing news:', error);
    return null;
  }
};

export const fetchSuggestions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { suggestions: [] };
    const response = await fetch(`${API_BASE_URL}/user/suggestions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Suggestions error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return { suggestions: [] };
  }
};

export const chatWithAI = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      if (!response.ok) return { reply: data.reply || `Cosmic error: ${response.status}` };
      return data;
    } else {
      const text = await response.text();
      return { reply: `Non-JSON Response from backend: ${text.slice(0, 50)}...` };
    }
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return { reply: `Connection Failed: Could not reach the backend server at ${API_BASE_URL}. Ensure the Node.js server is running.` };
  }
};
