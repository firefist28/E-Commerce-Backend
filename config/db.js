const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('mongo db ' + process.env.MONGO_URI);
        await mongoose.connect('mongodb://localhost:27017/e-commerce');
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
