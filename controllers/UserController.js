const pool = require("../db");
const bcrypt = require("bcrypt");
const sendResetEmail = require("../libs/emails/emails");
// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT users.id, users.user_name, users.user_email, users.user_matricula, users.role_id,roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id ORDER BY id ASC"
    );
    res.status(200).json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query(
      "SELECT users.id , users.user_name, users.user_email, users.user_matricula, users.role_id,roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { user_name, user_email, user_password, user_matricula, role_id } = req.body; 
    try {
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE user_email = $1 OR user_matricula = $2",
        [user_email, user_matricula]
      );
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya existe con ese correo electrónico o matrícula." });
      }

      //validar que la matricula sea de 9 digitos
        if(user_matricula.length !== 9){
            return res.status(400).json({ message: "La matrícula debe tener 9 dígitos." });
        }
  
      const saltRounds = 10; 
      const genSalt = await bcrypt.genSalt(saltRounds); 
      const bcryptPassword = await bcrypt.hash(user_password, genSalt); 
  
      await pool.query(
        "INSERT INTO users (user_name, user_email, user_password, user_matricula, role_id) VALUES ($1, $2, $3, $4, $5)",
        [user_name, user_email, bcryptPassword, user_matricula, role_id] 
      );
  
      res.status(201).json({ message: "Usuario agregado con éxito!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  };
  
// Actualizar un usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { user_name, user_email, user_matricula, role_id } = req.body; 
  
    try {
      
      const updates = [];
      const values = [];
  
   
      if (user_name) {
        updates.push(`user_name = $${updates.length + 1}`);
        values.push(user_name);
      }
      if (user_email) {
        updates.push(`user_email = $${updates.length + 1}`);
        values.push(user_email);
      }
      if (user_matricula) {
        updates.push(`user_matricula = $${updates.length + 1}`);
        values.push(user_matricula);
      }
      if (role_id) {
        updates.push(`role_id = $${updates.length + 1}`);
        values.push(role_id);
      }
  
      if (updates.length === 0) {
        return res.status(400).json({ message: "No hay campos para actualizar." });
      }
  
      
      values.push(id);
  
      
      const result = await pool.query(
        `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length}`,
        values
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };
  
// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
