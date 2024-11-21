require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

app.use((err, req, resp, next) => {
    console.error(err.stack);
    resp.status(500).send({ error: "Something Went Wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
