// queries.js

// User-related queries
const CHECK_IF_USER_EXISTS = 'SELECT * FROM UserProfile WHERE username = $1';
const INSERT_NEW_USER = `
    INSERT INTO UserProfile (username, pincode, firstName, lastName, password) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;

// Product-related queries
const GET_ALL_PRODUCTS = 'SELECT * FROM Product';
const INSERT_NEW_PRODUCT = `
    INSERT INTO Product (fromUserId, availableFrom, availableTill, askPrice, imageLink, description, pincode, productType, companyName, taluka) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`;

// Booking-related queries
const GET_ALL_BOOKINGS = 'SELECT * FROM Booking';
const INSERT_NEW_BOOKING = `
    INSERT INTO Booking (productId, askerId, numberOfHours, status, bookerSign, lenderSign, whenDate) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`;

module.exports = {
    CHECK_IF_USER_EXISTS,
    INSERT_NEW_USER,
    GET_ALL_PRODUCTS,
    INSERT_NEW_PRODUCT,
    GET_ALL_BOOKINGS,
    INSERT_NEW_BOOKING,
};
