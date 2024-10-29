const pool = require("../db");

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user;

            // Consulta para obtener los permisos del usuario
            const result = await pool.query(
                `SELECT p.id,u.user_name,p.permiso_name FROM users u 
                JOIN roles r ON u.role_id = r.id 
                JOIN role_permisos rp ON r.id = rp.role_id 
                JOIN permisos p ON rp.permiso_id = p.id WHERE u.id = $1`,
                [userId]
            );

            // Extraer los permisos del resultado
            const permissions = result.rows.map((row) => row.id);

            // Verificar si el permiso del usuario está en la lista de permisos
            if (!permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    error: "Acceso denegado",
                    message: "No tienes permisos para realizar esta acción."
                });
            }
            
            // Si el permiso es válido, continúa con la siguiente función
            next();
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    };
};

module.exports = checkPermission;


module.exports = checkPermission;
