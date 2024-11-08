const PORT = process.env.PORT || 5000;
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const turfRoutes = require('./routes/turfRoutes'); // Assuming you've created this route for turf management
const bookingRoutes = require('./routes/bookingRoutes'); // Assuming booking management routes

const errorHandler = require('./middleware/errorHandler');

const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes); 
app.use('/api/bookings', bookingRoutes); 

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
