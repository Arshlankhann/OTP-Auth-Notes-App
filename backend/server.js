
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors'); // For handling CORS issues

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Error Handler Middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
