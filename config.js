require('dotenv').config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5433;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '12345678';
const DB_DATABASE = process.env.DB_DATABASE || 'encuesta_egresados';
const PORT = process.env.PORT || 5000;
const DB_SSL=true
const JWT_SECRET = "cat123";

module.exports = {
    EMAIL_PASS,
    EMAIL_USER,
    FRONTEND_URL,
    DB_SSL,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    PORT,
    JWT_SECRET
};
