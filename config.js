"use strict";

// shared configurations for application

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

const CLOUDINARY_API_KEY = "jmcappdev"
const CLOUDINARY_API_SECRET = "756977366964151"
const CLOUDINARY_NAME = "lqwI2S7LkJVun2h5M-U4f_VOO84"

//  Use dev database, testing database, or production database via env variable.
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
    ? "hortu_test"
    : process.env.DATABASE_URL || "hortu";
}

// Speed up bcrypt during tests.
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

console.log("Hortu Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_NAME
};