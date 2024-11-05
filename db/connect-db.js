const mongoose = require('mongoose');
// require('dotenv').config();

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;