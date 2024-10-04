
CREATE TABLE UserProfile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    pincode VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    imageprofile VARCHAR(300) DEFAULT NULL,
);

CREATE TABLE Product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fromUserId UUID NOT NULL,
    availableFrom TIMESTAMP NOT NULL,
    availableTill TIMESTAMP NOT NULL,
    askPrice FLOAT NOT NULL,
    imageLink TEXT NOT NULL,
    description TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    productType VARCHAR(200) NOT NULL,
    companyName VARCHAR(200) NOT NULL,
    taluka VARCHAR(200) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES UserProfile(id)
);

CREATE TABLE Booking (
    id VARCHAR(300) PRIMARY KEY,
    productId UUID NOT NULL,
    askerId UUID NOT NULL,
    numberOfHours INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    bookerSign BOOLEAN NOT NULL,
    lenderSign BOOLEAN NOT NULL,
    whenDate TIMESTAMP NOT NULL,
    FOREIGN KEY (productId) REFERENCES Product(id),
    FOREIGN KEY (askerId) REFERENCES UserProfile(id)
);
