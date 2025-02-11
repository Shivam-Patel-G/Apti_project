const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoute');
const studentRoutes = require('./routes/studentRoute');
const authRoutes = require('./routes/authRoute');

const app = express();

// Use CORS middleware to allow requests from your frontend origin
const allowedOrigins = [
    'https://apty.onrender.com/login/student',
    'https://apty.onrender.com/login/admin',
    'https://apty.onrender.com/register/admin',
    'https://apty.onrender.com/register/student',
     'https://apti-project.onrender.com',
    'https://apty.onrender.com',
    'https://apty.onrender.com/admindashboard',
    'https://apty.onrender.com/studentdashboard',
    'https://apty-project.vercel.app',
    'http://localhost:5173',
    'https://apti-frontend.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions)); // Place CORS middleware here
// Enable Preflight requests for all routes
app.options('*', cors(corsOptions));
app.use(express.json());

// Define your routes after the CORS middleware
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.get('/', (req, res) => {
    res.send('Server is running!');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
