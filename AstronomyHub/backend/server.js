require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
if (process.env.SKIP_DB === 'true') {
  console.log('Skipping MongoDB connection as SKIP_DB=true');
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// --- AUTH ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login/Signup
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new User({
        username: name.replace(/\s+/g, '_').toLowerCase() + Math.floor(Math.random() * 1000),
        email,
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

// --- MIDDLEWARE ---
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next(); // Allow non-logged in users for some routes
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
};

// --- API PROXY ROUTES (Security Layer) ---

// AI News Analysis & Personalization
app.post('/api/news/analyze', auth, async (req, res) => {
  try {
    const { text } = req.body;
    // Call Python AI Service
    const aiResponse = await axios.post('http://localhost:8000/analyze', { text });
    const { summary, keywords, classification } = aiResponse.data;

    // Personalize if user is logged in
    if (req.user) {
      // Add top keywords to user interests, avoiding duplicates and limiting to top 20
      const currentInterests = new Set(req.user.interests);
      keywords.slice(0, 3).forEach(kw => currentInterests.add(kw.toLowerCase()));
      req.user.interests = Array.from(currentInterests).slice(-20);
      await req.user.save();
    }

    res.json({ summary, keywords, classification });
  } catch (err) {
    console.error('AI Analysis Error:', err.message);
    res.status(500).json({ message: 'Error connecting to AI service' });
  }
});

// User Suggestions based on Interests
app.get('/api/user/suggestions', auth, async (req, res) => {
  if (!req.user || !req.user.interests.length) {
    return res.json({ message: 'No interests found yet. Analyze some news to get suggestions!', suggestions: [] });
  }

  try {
    const interest = req.user.interests[Math.floor(Math.random() * req.user.interests.length)];
    const response = await axios.get(`https://images-api.nasa.gov/search?q=${interest}&media_type=image`);
    const items = response.data.collection.items.slice(0, 5).map(item => ({
      type: 'image',
      nasaId: item.data[0].nasa_id,
      title: item.data[0].title,
      thumbnail: item.links[0].href,
      reason: `Based on your interest in "${interest}"`
    }));
    res.json({ suggestions: items });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching suggestions' });
  }
});

//AI Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const aiResponse = await axios.post('http://localhost:8000/chat', { message }, { timeout: 60000 });
    console.log('>>> [BACKEND] AI Response Received:', aiResponse.data);
    res.json(aiResponse.data);
  } catch (err) {
    console.error('AI Chat Error:', err.message);
    const status = err.response ? err.response.status : 500;
    
    let msg = 'Cosmic AI is currently deep in space.';
    if (err.code === 'ECONNABORTED') msg = 'AI response timed out (30s). The model might be slow on the first run.';
    if (err.code === 'ECONNREFUSED') msg = 'AI Service Unreachable: Ensure the Python script is running on port 8000.';
    
    res.status(status).json({ reply: msg, error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// NASA APOD Proxy
app.get('/api/nasa/apod', async (req, res, next) => {
  console.log('>>> [BACKEND] Request received for /api/nasa/apod');
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    console.log('>>> [BACKEND] Fetching NASA APOD...');
    
    // Explicitly handle timeout
    const response = await axios.get(url, { timeout: 10000 }).catch(e => {
      console.log('>>> [BACKEND] Axios internal catch triggered:', e.message);
      return { isError: true, message: e.message };
    });

    if (response.isError) {
       throw new Error(response.message);
    }

    console.log('>>> [BACKEND] NASA API Success');
    return res.json(response.data);
  } catch (err) {
    console.error('>>> [BACKEND] APOD ROUTE ERROR:', err.message);
    
    // Return fallback instead of 500
    console.log('>>> [BACKEND] Serving Fallback JSON');
    return res.status(200).json({
      title: "The Pillars of Creation (Fallback)",
      url: "https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg",
      explanation: "A spectacular view of the Pillars of Creation, where new stars are forming within dense clouds of gas and dust. This iconic region within the Eagle Nebula is captured here in stunning detail.",
      date: new Date().toISOString().split('T')[0],
      copyright: "NASA/Hubble (Fallback)"
    });
  }
});

// NASA Images Proxy
app.get('/api/nasa/images', async (req, res) => {
  try {
    const { q, page, media_type, year_start, year_end } = req.query;
    
    // Build parameters for NASA API
    const params = {
      q,
      page: page || 1,
      media_type: media_type || 'image,video'
    };
    
    if (year_start) params.year_start = year_start;
    if (year_end) params.year_end = year_end;

    const response = await axios.get(`https://images-api.nasa.gov/search`, { params });
    res.json(response.data);
  } catch (err) {
    console.error('NASA Images Proxy Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Error fetching NASA images' });
  }
});

// YouTube Videos Proxy
app.get('/api/youtube/videos', async (req, res) => {
  try {
    const { q, lang } = req.query;
    let refinedQuery = `${q} astronomy -shorts -panel -panels`;
    
    // Target top Hindi science creators if lang=hi
    if (lang === 'hi') {
      refinedQuery = `${q} astronomy hindi GetSetFlyScience Antariksh TV -shorts`;
    }

    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 12,
        q: refinedQuery,
        type: 'video',
        relevanceLanguage: lang || 'en',
        videoDuration: 'medium',
        order: 'relevance',
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle
    }));

    res.json(videos);
  } catch (err) {
    console.error('YouTube Proxy Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Error fetching YouTube videos' });
  }
});

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('!!! GLOBAL ERROR CAUGHT:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Backend running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
