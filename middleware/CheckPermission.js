const pool = require("../db");

const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.user;

            // Consulta para obtener los permisos del usuario
            const result = await pool.query(
                `SELECT p.id, u.user_name, p.permiso_name FROM users u 
                 JOIN roles r ON u.role_id = r.id 
                 JOIN role_permisos rp ON r.id = rp.role_id 
                 JOIN permisos p ON rp.permiso_id = p.id WHERE u.id = $1`,
                [userId]
            );

            
            const permissions = result.rows.map((row) => row.id);

           
            const hasPermission = requiredPermissions.some(permission => permissions.includes(permission));

            if (!hasPermission) {
                return res.status(403).json({
                    error: "Acceso denegado",
                    message: "No tienes permisos para realizar esta acción."
                });
            }

            next();
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    };
};

module.exports = checkPermission;
