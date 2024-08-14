// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
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
});


app.post('/login', async (req, res) => {
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

        // Login successful
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// User routes
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.userProfile.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { username, pincode, firstName, lastName } = req.body;
        const newUser = await prisma.userProfile.create({
            data: { username, pincode, firstName, lastName },
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product routes
app.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/products', async (req, res) => {
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
});

// Booking routes
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/bookings', async (req, res) => {
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
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
