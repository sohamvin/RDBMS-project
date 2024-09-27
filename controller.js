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
            fromUserId,
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
            [fromUserId, availableFrom, availableTill, askPrice, imageLink, description, pincode, productType, companyName, taluka]
        );

        res.json(newProduct.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Booking controller functions
const getBookings = async (req, res) => {
    try {
        const bookings = await db.query(queries.GET_ALL_BOOKINGS);
        res.json(bookings.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBooking = async (req, res) => {
    try {
        const {
            productId,
            askerId,
            numberOfHours,
            status,
            bookerSign,
            lenderSign,
            whenDate,
        } = req.body;

        const newBooking = await db.query(
            queries.INSERT_NEW_BOOKING,
            [productId, askerId, numberOfHours, status, bookerSign, lenderSign, whenDate]
        );

        res.json(newBooking.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProducts,
    createProduct,
    getBookings,
    createBooking,
};
