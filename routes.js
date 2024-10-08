// routes.js
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
    registerUser,
    loginUser,
    getProducts,
    createProduct,
    createBooking,
    getBookingsByUser,
    getMyProductsBookedByOthers,
    updateBookingStatus,
    deleteBooking,
    getUser,
} = require('./controller');
const verifyToken = require('./middleware/auth');

const router = express.Router();

// User routes
router.post('/register', upload.single('image'), registerUser); // No token required
router.post('/login', loginUser); // No token required
router.get('/products', getProducts);
// Apply verifyToken middleware to all routes below this line
router.use(verifyToken);

router.get('/getUser', getUser);

router.post('/products', upload.single('image'), createProduct);
router.get('/booked_of_me', getMyProductsBookedByOthers);
router.post('/bookings', createBooking);
router.get("/mybookings", getBookingsByUser);
router.put('/update_booking_status', updateBookingStatus);
router.delete('/delete_booking', deleteBooking);

module.exports = router;
