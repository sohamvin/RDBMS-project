const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const queries = require('./queries');

// User controller functions
const registerUser = async (req, res) => {
    try {
        const { username, pincode, firstName, lastName, password } = req.body;

        console.log(req.body);
        

        // Check if the user already exists
        const userResult = await db.query(queries.CHECK_IF_USER_EXISTS, [username]);

        console.log(userResult);
        

        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await db.query(
            queries.INSERT_NEW_USER,
            [username, pincode, firstName, lastName, hashedPassword]
        );

        console.log(newUser);
        

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const userResult = await db.query(queries.CHECK_IF_USER_EXISTS, [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = userResult.rows[0];

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Login successful
        res.json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Product controller functions
const getProducts = async (req, res) => {
    try {
        const products = await db.query(queries.GET_ALL_PRODUCTS);
        res.json(products.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            availableFrom,
            availableTill,
            askPrice,
            imageLink,
            description,
            pincode,
            productType,
            companyName,
            taluka,
        } = req.body;

        const newProduct = await db.query(
            queries.INSERT_NEW_PRODUCT,
            [req.user.userId, availableFrom, availableTill, askPrice, imageLink, description, pincode, productType, companyName, taluka]
        );

        res.json(newProduct.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getMyProductsBookedByOthers = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming req.user contains authenticated user's info

        // Get user's products booked by others

        const myProductsBookedByOthers = await db.query(queries.GET_MY_PRODUCTS_BOOKED_BY_OTHERS, [userId]);

        console.log(myProductsBookedByOthers.rows);
        

        res.json({
            myProductsBookedByOthers: myProductsBookedByOthers.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.query; // Booking ID comes from the URL
        const { status } = req.body; // The new status is sent in the request body
        const userId = req.user.userId; // Assuming req.user contains authenticated user's info

        // Step 1: Validate if the booking exists and the product belongs to the current user
        const productOwner = await db.query(
            queries.GET_PERTICULAR_BOOKING
            , [bookingId]);

        if (productOwner.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Step 2: Check if the current user is the owner of the product
        if (productOwner.rows[0].fromuserid !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this booking' });
        }

        // Step 3: Update the booking status
        const updatedBooking = await db.query(queries.UPDATE_BOOKING_STATUS, [status, bookingId]);

        if (updatedBooking.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found or status unchanged' });
        }

        res.json(updatedBooking.rows[0]); // Return the updated booking
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const createBooking = async (req, res) => {
    try {
        const {
            productId,
            numberOfHours,
            status,
            bookerSign,
            lenderSign,
            whenDate,
        } = req.body;

        // Get the owner of the product
        const productOwner = await db.query(queries.GET_PRODUCT_OWNER, [productId]);

        if (productOwner.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user is trying to book their own product
        if (productOwner.rows[0].fromuserid === req.user.userId) {
            return res.status(400).json({ error: 'You cannot book your own product' });
        }

        // Proceed with creating the booking
        const newBooking = await db.query(
            queries.INSERT_NEW_BOOKING,
            [productId, req.user.userId, numberOfHours, status, bookerSign, lenderSign, whenDate]
        );

        res.json(newBooking.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.query; // Booking ID from the URL path
        const userId = req.user.userId; // Assuming req.user contains the authenticated user's info

        // Step 1: Attempt to delete the booking if the user is the one who made the booking (askerId)
        const deletedBooking = await db.query(queries.DELETE_BOOKING_BY_USER, [bookingId, userId]);

        // Step 2: If no rows are returned, the booking was not found or the user is not the asker
        if (deletedBooking.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found or you are not authorized to delete this booking' });
        }

        // Step 3: Return a success message
        res.json({ message: 'Booking deleted successfully', deletedBooking: deletedBooking.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming the userId is in req.user from the auth middleware
        const userBookings = await db.query(queries.GET_BOOKINGS_BY_USER, [userId]);
        res.json(userBookings.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProducts,
    createProduct,
    createBooking,
    getBookingsByUser,
    getMyProductsBookedByOthers,
    updateBookingStatus,
    deleteBooking,
};
