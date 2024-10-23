const express = require("express");
const cors = require("cors");
const { FRONTEND_URL, PORT } = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] 
}));

// Rutas
app.use('/auth', require('./routes/encuestaAuth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
