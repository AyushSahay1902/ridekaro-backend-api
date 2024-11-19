const axios = require('axios');
const Product = require('../schemas/productSchema');

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

const getAllProductPrices = async (req, res) => {
    try {
        const { start, end } = req.query;
        const rider = req.query.rider;

        if (!start || !end) {
            return res.status(400).json({ success: false, msg: "Start and end coordinates are required." });
        }


        const [startLat, startLon] = start.split(',').map(Number);
        const [endLat, endLon] = end.split(',').map(Number);

        if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) {
            return res.status(400).json({ success: false, msg: "Invalid coordinates format. Use 'lat,lon' format." });
        }

        // Check if the same start and end coordinates already exist in the database
        const existingProduct = await Product.findOne({
            "start.latitude": startLat,
            "start.longitude": startLon,
            "end.latitude": endLat,
            "end.longitude": endLon,
            "rider": rider,
        });

        if (existingProduct) {
            return res.status(200).json({
                success: true,
                distance: `${existingProduct.distance.toFixed(2)} km`,
                price: `Rs${existingProduct.price.toFixed(2)}`,
                rider: existingProduct.rider,
            });
        }

        const distance = await getDistance({ lat: startLat, lon: startLon }, { lat: endLat, lon: endLon });
        const estimatedTime = (distance / 100) * 60;

        const calculateFare = (distance, time, surgeMultiplier = 1) => {
            const baseFare = 50;
            const perKmRate = 10;
            const perMinuteRate = 2;
            return (baseFare + (distance * perKmRate) + (time * perMinuteRate)) * surgeMultiplier;
        };

        const price = calculateFare(distance, estimatedTime, 1.5);

        const product = await Product.create({
            start: { latitude: startLat, longitude: startLon },
            end: { latitude: endLat, longitude: endLon },
            price: price,
            distance: distance,
            rider: rider,
        });

        res.status(200).json({
            success: true,
            distance: `${distance.toFixed(2)} km`,
            price: `Rs${price.toFixed(2)}`,
            rider: rider,
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};




const testingPrices = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: 'Testing prices' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = { getAllProductPrices, testingPrices };