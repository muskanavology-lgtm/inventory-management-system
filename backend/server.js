const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// dotenv.config() MUST be called before connectDB
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', require('./routes/itemRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));