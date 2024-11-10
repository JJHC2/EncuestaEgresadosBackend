const FRONTEND_URL = process.env.FRONTEND_URL; 
const EMAIL_USER="al222110834@gmail.com";
const EMAIL_PASS="sfpj tbgi ljfi finy";
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5433;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '12345678';
const DB_DATABASE = process.env.DB_DATABASE || 'encuesta_egresados';
const PORT = process.env.PORT || 5000;

module.exports = {
    EMAIL_PASS,
    EMAIL_USER,
    FRONTEND_URL,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    PORT,
    };