const axios = require('axios');
require('dotenv').config();

async function testNasaApi() {
  const apiKey = process.env.NASA_API_KEY;
  console.log('Using API Key:', apiKey);
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    console.log('SUCCESS: ', response.data.title);
  } catch (err) {
    if (err.response) {
      console.error('ERROR Status:', err.response.status);
      console.error('ERROR Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('ERROR Message:', err.message);
    }
  }
}

testNasaApi();
