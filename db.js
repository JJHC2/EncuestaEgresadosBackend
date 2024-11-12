//Esta es la conexión a la base de datos
const {DB_PORT,DB_USER,DB_PASSWORD,DB_HOST,DB_DATABASE,DB_SSL} = require('./config.js');
const Pool = require('pg').Pool

const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    //Agrgear el ssl
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
