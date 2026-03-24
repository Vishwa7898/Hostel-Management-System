const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: true, // Allow all origins (for flexible local development ports like 5174, 5175, etc.)
    credentials: true
}));

// IMPORTANT: Stripe webhook needs raw body (must be BEFORE express.json)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular middleware (after webhook raw parser)
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        console.log('Database:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/allocations', require('./routes/allocations'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));