module.exports = (req, res, next) => {
    const { email, name, password, matricula } = req.body;

    // Validación de correo electrónico
    function validEmail(userEmail) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    }

    // Validación de matrícula (máximo 9 caracteres)
    if (matricula && matricula.length > 9) {
        return res.status(401).json("Matrícula no debe ser mayor a 9 caracteres");
    }

    // Validación de contraseña (máximo 15 caracteres, sin caracteres especiales)
    function validPassword(userPassword) {
        return /^[A-Za-z0-9]{1,15}$/.test(userPassword); // Solo letras y números, hasta 15 caracteres
    }

    if (req.path === "/register") {
        if (![email, name, password, matricula].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        } else if (!validPassword(password)) {
            return res.status(401).json("La contraseña no debe superar 15 caracteres y solo debe contener letras y números.");
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        } else if (!validPassword(password)) {
            return res.status(401).json("La contraseña no debe superar 15 caracteres y solo debe contener letras y números.");
        }
    }

    next();
};
