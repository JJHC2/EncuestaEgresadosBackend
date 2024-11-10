const jwt = require('jsonwebtoken');
require('dotenv').config();

// Modulo para validar el token 
module.exports = async (req, res, next) => {
    try {
        const token = req.header("token");
        if (!token) {
            return res.status(403).json({ message: "Authorization Denied" });
        }

        const payload = jwt.verify(token, process.env.jwtSecret);
        console.log("Payload:", payload); 
        req.user = payload.user;

        next();
    } catch (err) {
        console.log(err);

        // Detecta si el error es por expiración del token
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado' });
        }

        // Otros errores de autenticación
        res.status(401).json({ message: 'token expirado' });
    }
};
