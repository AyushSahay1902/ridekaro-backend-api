const axios = require('axios');

// Function to get the distance using Mapbox API
const getDistance = async (start, end) => {
    const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    // Construct URL with lat/lon pairs for Mapbox API
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lon},${start.lat};${end.lon},${end.lat}`;

    const response = await axios.get(url, {
        params: {
            access_token: accessToken,
            geometries: 'geojson'
        }
    });

    // Extract distance from the response in meters and convert to kilometers
    const distance = response.data.routes[0].distance / 1000;
    return distance;
};

// Controller function to calculate the price based on the distance
const getAllProductPrices = async (req, res) => {
    try {
        // Get start and end coordinates from query parameters
        const { start, end } = req.query;

        // Ensure both start and end coordinates are provided
        if (!start || !end) {
            return res.status(400).json({ success: false, msg: "Start and end coordinates are required." });
        }

        // Parse coordinates (assuming they are provided as "lat,lon")
        const [startLat, startLon] = start.split(',').map(Number);
        const [endLat, endLon] = end.split(',').map(Number);

        // Check if parsing was successful
        if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) {
            return res.status(400).json({ success: false, msg: "Invalid coordinates format. Use 'lat,lon' format." });
        }

        // Calculate the distance using getDistance (assuming it’s an async function that accepts lat/lon pairs)
        const distance = await getDistance({ lat: startLat, lon: startLon }, { lat: endLat, lon: endLon });

        // Example time estimation, assuming average speed of 100 km/h (modify as needed)
        const estimatedTime = (distance / 100) * 60; // Time in minutes

        // Calculate price based on distance and time
        const calculateFare = (distance, time, surgeMultiplier = 1) => {
            const baseFare = 50; // Base fare in local currency
            const perKmRate = 10; // Per kilometer rate
            const perMinuteRate = 2; // Per minute rate

            // Calculate base fare + distance fare + time fare, then apply surge
            const fare = (baseFare + (distance * perKmRate) + (time * perMinuteRate)) * surgeMultiplier;
            return fare;
        };

        // Calculate price using distance, estimated time, and surge multiplier
        const price = calculateFare(distance, estimatedTime, 1.5);

        // Respond with both distance and price
        res.status(200).json({
            success: true,
            distance: `${distance.toFixed(2)} km`,
            price: `Rs${price.toFixed(2)}`
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message || "An error occurred." });
    }
};

module.exports = { getAllProductPrices };


const testingPrices = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: 'Testing prices' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = { getAllProductPrices, testingPrices };