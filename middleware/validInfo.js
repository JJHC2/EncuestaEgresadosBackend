module.exports = (req, res, next) => {
    const { email, name, password, matricula } = req.body;

    // Validación de correo electrónico
    function validEmail(userEmail) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    }

    // Validación de matrícula (debe ser numérica y de 4 a 9 caracteres)
    function validMatricula(userMatricula) {
        return /^[0-9]{4,9}$/.test(userMatricula); 
    }

    // Validación de nombre (solo letras)
    function validName(userName) {
        return /^[A-Za-z\s]+$/.test(userName); 
    }

    // Validación de contraseña (de 4 a 15 caracteres, solo letras y números)
    function validPassword(userPassword) {
        return /^[A-Za-z0-9]{4,15}$/.test(userPassword);
    }

    if (req.path === "/register") {
        if (![email, name, password, matricula].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        } else if (!validName(name)) {
            return res.status(401).json("El nombre solo debe contener letras y espacios.");
        } else if (!validMatricula(matricula)) {
            return res.status(401).json("La matrícula debe ser numérica y tener entre 4 y 9 caracteres.");
        } else if (!validPassword(password)) {
            return res.status(401).json("La contraseña debe tener entre 4 y 15 caracteres y solo contener letras y números.");
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        } else if (!validPassword(password)) {
            return res.status(401).json("La contraseña debe tener entre 4 y 15 caracteres y solo contener letras y números.");
        }
    }

    next();
};
