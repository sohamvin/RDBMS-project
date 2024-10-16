-- Create userprofile table
CREATE TABLE UserProfile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imageprofile VARCHAR(300) DEFAULT NULL,
    phonenumber VARCHAR(20) DEFAULT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create product table
CREATE TABLE Product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fromUserId UUID NOT NULL,
    availableFrom TIMESTAMP NOT NULL,
    availableTill TIMESTAMP NOT NULL,
    askPrice FLOAT8 NOT NULL,
    imageLink TEXT NOT NULL,
    description TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    productType VARCHAR(200) NOT NULL,
    companyName VARCHAR(200) NOT NULL,
    taluka VARCHAR(200) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES UserProfile(id)
);

-- Create booking table
CREATE TABLE Booking (
    id SERIAL PRIMARY KEY,
    bookingDate TIMESTAMP NOT NULL,
    productId UUID NOT NULL,
    askerId UUID NOT NULL,
    numberOfHours INT4 NOT NULL,
    status VARCHAR(20) NOT NULL,
    whenDate TIMESTAMP NOT NULL,
    FOREIGN KEY (productId) REFERENCES Product(id),
    FOREIGN KEY (askerId) REFERENCES UserProfile(id)
);
