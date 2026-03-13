const axios = require('axios');

async function triggerApod() {
  try {
    const response = await axios.get('http://localhost:5000/api/nasa/apod');
    console.log('Backend Response:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('Backend Error Status:', err.response.status);
      console.error('Backend Error Data:', err.response.data);
    } else {
      console.error('Error connecting to backend:', err.message);
    }
  }
}

triggerApod();
