const axios = require('axios');

async function testFilters() {
    const baseUrl = 'http://localhost:5000/api/nasa/images';
    
    console.log('--- Testing NASA Search Filters ---');
    
    try {
        // Test 1: Video filter
        console.log('\nTesting Video-only filter for "Mars"...');
        const videoResponse = await axios.get(`${baseUrl}?q=Mars&media_type=video`);
        const videoItems = videoResponse.data.collection.items;
        console.log(`Found ${videoItems.length} items.`);
        const nonVideo = videoItems.filter(item => item.data[0].media_type !== 'video');
        if (nonVideo.length === 0) {
            console.log('✅ All results are videos.');
        } else {
            console.log('❌ Found non-video items:', nonVideo.length);
        }

        // Test 2: Year range filter
        console.log('\nTesting Year Range filter (2023-2024) for "Jupiter"...');
        const yearResponse = await axios.get(`${baseUrl}?q=Jupiter&year_start=2023&year_end=2024`);
        const yearItems = yearResponse.data.collection.items;
        console.log(`Found ${yearItems.length} items.`);
        const outOfRange = yearItems.filter(item => {
            const year = new Date(item.data[0].date_created).getFullYear();
            return year < 2023 || year > 2024;
        });
        if (outOfRange.length === 0) {
            console.log('✅ All results are within 2023-2024.');
        } else {
            console.log('❌ Found items out of range:', outOfRange.length);
            console.log('First few dates:', yearItems.slice(0, 3).map(i => i.data[0].date_created));
        }

    } catch (err) {
        console.error('Error during test:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

testFilters();
