const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

dotenv.config({ quiet: true });

connectDB(); 

const app = express();

app.use(express.json());
app.use(cors()); 

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
