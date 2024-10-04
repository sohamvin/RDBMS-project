const cloudinary = require('cloudinary').v2;
require('dotenv').config();


// Configuration
cloudinary.config({ 
  cloud_name: process.env.COULD_NAME, 
  api_key: process.env.CLOUDINARY,
  api_secret: process.env.CLUDINARY_SECRETE, 
});
