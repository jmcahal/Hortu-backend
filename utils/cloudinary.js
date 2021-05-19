const {CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_NAME} = require('../config');
const cloudinary = require('cloudinary').v2;
const { uploader, config } = require('cloudinary');

const dotenv = require('dotenv');

dotenv.config();

const cloudinaryConfig = (req, res, next) => {
    config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    next();
}

module.exports = { cloudinaryConfig, uploader };