const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name : process.env.Cloud_Name,
    api_key    : process.env.Cloud_Key,
    api_secret : process.env.Cloud_Secret
});