// queries.js

// User-related queries
const CHECK_IF_USER_EXISTS = 'SELECT * FROM UserProfile WHERE username = $1';

const INSERT_NEW_USER = `
    INSERT INTO UserProfile (username, pincode, firstName, lastName, password, imageprofile) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`;

const GET_USER = `
    SELECT username, pincode, firstname, lastname, imageprofile 
    FROM UserProfile 
    WHERE id = $1
`;


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

const GET_BOOKINGS_BY_USER = `
    SELECT p.id, p.availablefrom, p.availabletill, p.askprice, p.producttype, b.numberofhours, b.whendate, p.imagelink, p.pincode, p.fromuserid FROM Product p
    JOIN Booking b ON p.id = b.productid 
    WHERE b.askerId = $1
`;

const GET_PRODUCT_OWNER = `
    SELECT fromUserId FROM Product 
    WHERE id = $1
`;

// Query to get the products booked by the current user (askerId)
const GET_PRODUCTS_BOOKED_BY_ME = `
    SELECT B.*, P.* FROM Booking B
    JOIN Product P ON B.productId = P.id
    WHERE B.askerId = $1
`;

// Query to get the user's products that have been booked by others (fromUserId)
const GET_MY_PRODUCTS_BOOKED_BY_OTHERS = `
    SELECT B.* FROM Booking B
    JOIN Product P ON B.productId = P.id
    WHERE P.fromUserId = $1
`;

const UPDATE_BOOKING_STATUS = `
    UPDATE Booking 
    SET status = $1 
    WHERE id = $2
    RETURNING *;
`;

const GET_PERTICULAR_BOOKING =`SELECT P.fromUserId 
            FROM Booking B
            JOIN Product P ON B.productId = P.id
            WHERE B.id = $1`;

const DELETE_BOOKING_BY_USER = `
            DELETE FROM Booking 
            WHERE id = $1 AND askerId = $2
            RETURNING *;
        `;


module.exports = {
    CHECK_IF_USER_EXISTS,
    INSERT_NEW_USER,
    GET_ALL_PRODUCTS,
    INSERT_NEW_PRODUCT,
    GET_ALL_BOOKINGS,
    INSERT_NEW_BOOKING,
    GET_BOOKINGS_BY_USER,
    GET_PRODUCT_OWNER,
    GET_PRODUCTS_BOOKED_BY_ME,
    GET_MY_PRODUCTS_BOOKED_BY_OTHERS,
    UPDATE_BOOKING_STATUS,
    GET_PERTICULAR_BOOKING,
    DELETE_BOOKING_BY_USER,
    GET_USER,

};
