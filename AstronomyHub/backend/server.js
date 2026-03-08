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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// --- API PROXY ROUTES (Security Layer) ---

// NASA APOD Proxy
app.get('/api/nasa/apod', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching APOD' });
  }
});

// NASA Images Proxy
app.get('/api/nasa/images', async (req, res) => {
  try {
    const { q, page } = req.query;
    const response = await axios.get(`https://images-api.nasa.gov/search?q=${q}&media_type=image&page=${page || 1}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching NASA images' });
  }
});

// YouTube Videos Proxy
app.get('/api/youtube/videos', async (req, res) => {
  try {
    const { q } = req.query;
    const refinedQuery = `${q} astronomy -shorts -panel -panels`;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: refinedQuery,
        type: 'video',
        videoDuration: 'medium',
        order: 'viewCount',
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
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
