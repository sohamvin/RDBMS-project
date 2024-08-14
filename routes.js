// routes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    getProducts,
    createProduct,
    getBookings,
    createBooking,
} = require('./controller');
const verifyToken = require('./middleware/auth');

const router = express.Router();

// User routes
router.post('/register', registerUser); // No token required
router.post('/login', loginUser); // No token required

// Apply verifyToken middleware to all routes below this line
router.use(verifyToken);

// Product routes
router.get('/products', getProducts);
router.post('/products', createProduct);

// Booking routes
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);

module.exports = router;
