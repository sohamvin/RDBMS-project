// controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// User controller functions
const registerUser = async (req, res) => {
    try {
        const { username, pincode, firstName, lastName, password } = req.body;

        // Check if the user already exists
        const existingUser = await prisma.userProfile.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await prisma.userProfile.create({
            data: {
                username,
                pincode,
                firstName,
                lastName,
                password: hashedPassword,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const user = await prisma.userProfile.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

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
        const products = await prisma.product.findMany();
        res.json(products);
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

        const newProduct = await prisma.product.create({
            data: {
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
            },
        });

        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Booking controller functions
const getBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.json(bookings);
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

        const newBooking = await prisma.booking.create({
            data: {
                productId,
                askerId,
                numberOfHours,
                status,
                bookerSign,
                lenderSign,
                whenDate,
            },
        });

        res.json(newBooking);
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
