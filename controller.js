const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const bcrypt = require('bcrypt');
const db = require('./db.js'); // Assuming db is your database handler
const queries = require('./queries.js');
require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { log } = require('console');


// Configuration
cloudinary.config({ 
  cloud_name: process.env.COULD_NAME, 
  api_key: process.env.CLOUDINARY,
  api_secret: process.env.CLUDINARY_SECRETE, 
});


const getUser = async (req, res) => {
    try {
        const self = req.query.self;

        let uId = null;

        console.log(self);
        console.log(self == true, self == "true" , self == `true`);
        
        console.log(req.user.userId);
        

        if(self == "true"){
            uId = req.user.userId;

        } else {
            uId = req.query.id

        }// Get user id from the query string
        
        if (!uId) {
            return res.status(400).json({ error: 'Bad request, no userId provided' });
        }

        // Query to get user details from the database
        const userResult = await db.query(queries.GET_USER, [uId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'No such user' });
        }

        // Return the user data as JSON
        const user = userResult.rows[0];
        return res.status(200).json({
            username: user.username,
            pincode: user.pincode,
            firstName: user.firstname,
            lastName: user.lastname,
            imageProfile: user.imageprofile
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: error.message });
    }
}



// User controller functions
const registerUser = async (req, res) => {
    try {
        const { username, pincode, firstName, lastName, password, phoneNumber } = req.body;
        const image = req.file; // Multer attaches the file in req.file if there's a file upload

        console.log(req.body);
        console.log(req.file); // Log the uploaded image file

        // Check if the user already exists
        const userResult = await db.query(queries.CHECK_IF_USER_EXISTS, [username]);

        console.log(userResult);
        
        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const getPhone  = await db.query(queries.CHECK_IF_PHONENUMBER_EXISTS, [phoneNumber]);

        if (getPhone.rows.length > 0) {
            return res.status(400).json({ error: 'Phone Number already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let imageProfileUrl = null;

        // Check if an image was uploaded, if so, upload to Cloudinary
        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: 'user_profiles',
                use_filename: true,
                unique_filename: false,
            });

            // Get the signed URL
            imageProfileUrl = cloudinary.url(result.public_id, {
                sign_url: true,
                secure: true,
                transformation: [
                    { width: 500, height: 500, crop: 'limit' }, // Optional resize
                ],
            });

            // Optionally delete the local file after uploading
            fs.unlinkSync(image.path);
        }

        // Create the user with the image URL if present
        const newUser = await db.query(
            queries.INSERT_NEW_USER,
            [username, pincode, firstName, lastName, hashedPassword, imageProfileUrl, phoneNumber]
        );

        console.log(newUser);

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error registering user:', error);
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
        const image = req.file; // Multer attaches the file to req.file if uploaded

        console.log(req.body);
        console.log(req.file); // Log the uploaded image file

        let imageProfileUrl = null;

        // Check if an image was uploaded, if so, upload to Cloudinary
        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: 'user_profiles',
                use_filename: true,
                unique_filename: false,
            });

            // Get the signed URL
            imageProfileUrl = cloudinary.url(result.public_id, {
                sign_url: true,
                secure: true,
                transformation: [
                    { width: 500, height: 500, crop: 'limit' }, // Optional resize
                ],
            });

            // Optionally delete the local file after uploading
            fs.unlinkSync(image.path); // Ensure 'fs' is imported for file deletion
        }

        const {
            availableFrom,
            availableTill,
            askPrice,
            description,
            pincode,
            productType,
            companyName,
            taluka,
        } = req.body;

        const imageLink = imageProfileUrl || req.body.imageLink; // Assign uploaded image link or default from request

        const newProduct = await db.query(
            queries.INSERT_NEW_PRODUCT,
            [
                req.user.userId,
                availableFrom,
                availableTill,
                askPrice,
                imageLink, // Make sure to use the correct image URL
                description,
                pincode,
                productType,
                companyName,
                taluka,
            ]
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

        console.log("YOOOOOOOO " , myProductsBookedByOthers.rows);
        

        res.json({
            myProductsBookedByOthers: myProductsBookedByOthers.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.query; // Booking ID comes from the URL query parameters
        const { status } = req.body; // The new status is sent in the request body
        const userId = req.user.userId; // Assuming req.user contains authenticated user's info

        console.log(bookingId, status);
        

        // Validate if the booking exists and the product belongs to the current user
        const productOwner = await db.query(queries.GET_PERTICULAR_BOOKING, [bookingId]);

        if (productOwner.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        console.log(productOwner);
        

        // Check if the current user is the owner of the product
        if (productOwner.rows[0].fromuserid !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this booking' });
        }

        // Update the booking status
        const updatedBooking = await db.query(queries.UPDATE_BOOKING_STATUS, [status, bookingId]);

        if (updatedBooking.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found or status unchanged' });
        }

        console.log(updatedBooking);
        

        res.json(updatedBooking.rows[0]); // Return the updated booking
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// const updateBookingStatus = async (req, res) => {
//     try {
//         const { bookingId } = req.query; // Booking ID comes from the URL
//         const { status } = req.body; // The new status is sent in the request body
//         const userId = req.user.userId; // Assuming req.user contains authenticated user's info

//         // Step 1: Validate if the booking exists and the product belongs to the current user
//         const productOwner = await db.query(
//             queries.GET_PERTICULAR_BOOKING
//             , [bookingId]);

//         if (productOwner.rows.length === 0) {
//             return res.status(404).json({ error: 'Booking not found' });
//         }

//         // Step 2: Check if the current user is the owner of the product
//         if (productOwner.rows[0].fromuserid !== userId) {
//             return res.status(403).json({ error: 'You are not authorized to update this booking' });
//         }

//         // Step 3: Update the booking status
//         const updatedBooking = await db.query(queries.UPDATE_BOOKING_STATUS, [status, bookingId]);

//         if (updatedBooking.rows.length === 0) {
//             return res.status(404).json({ error: 'Booking not found or status unchanged' });
//         }

//         res.json(updatedBooking.rows[0]); // Return the updated booking
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



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
    getUser,
};
