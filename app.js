// main.js
require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require('./routes/route');
const connectDB = require('./db/connect-db');

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/v1/getprice', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

