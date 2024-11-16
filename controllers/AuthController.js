
const pool = require("../db");
const bcrypt = require("bcrypt");
const sendResetEmail = require("../libs/emails/emails"); 
const jwt = require("jsonwebtoken");

const forgotPassword = async (req, res) => {
    const { user_email } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [user_email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "El usuario no existe" });
        }

        const resetToken = jwt.sign({ userId: user.rows[0].id }, process.env.jwtSecret, { expiresIn: "15m" });

        await sendResetEmail(user_email, resetToken);

        res.json({ message: "Se ha enviado un correo para restablecer la contraseña" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    if (!newPassword || newPassword.trim() === "") {
      return res.status(400).json({ error: "La contraseña no puede estar vacía." });
    }
  
    if (newPassword.length < 3) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.jwtSecret);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query("UPDATE users SET user_password = $1 WHERE id = $2", [hashedPassword, decoded.userId]);
      res.json({ message: "Contraseña actualizada" });
      console.log("Contraseña actualizada");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  };
  

module.exports = {
    forgotPassword,
    resetPassword,
};
