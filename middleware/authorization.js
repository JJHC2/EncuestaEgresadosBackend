const jwt = require('jsonwebtoken');
require('dotenv').config();

//Modulo para validar el token 
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
        res.status(401).json({ message: 'Unauthorized' });
    }
};

