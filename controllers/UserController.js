const pool = require("../db");
const bcrypt = require("bcrypt");

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT users.id, users.user_name, users.user_email, users.user_matricula, users.role_id,roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id ORDER BY id ASC"
    );
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { user_name, user_email, user_password, user_matricula, role_id } =
    req.body;

  try {
    
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_email = $1 OR user_matricula = $2",
      [user_email, user_matricula]
    );

    if (existingUser.rows.length > 0) {
      return res.status(401).json({
        error: "El usuario ya existe con ese correo electrónico o matrícula.",
      });
    }


    if (!/^\d{9}$/.test(user_matricula)) {
      return res.status(401).json({
        error:
          "La matrícula debe ser numérica y tener exactamente 9 dígitos.",
      });
    }

   
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(user_email)) {
      return res.status(401).json({
        error: "El correo electrónico no tiene un formato válido.",
      });
    }

    
    if (user_password.length < 2 || user_password.length > 15) {
      return res
        .status(401)
        .json({ error: "La contraseña debe tener entre 2 y 15 caracteres." });
    }

   
    if (user_name.length < 2) {
      return res
        .status(401)
        .json({ error: "El nombre debe tener más de 2 caracteres." });
    }

    
    const nameCheck = await pool.query(
      "SELECT * FROM users WHERE user_name = $1",
      [user_name]
    );
    if (nameCheck.rows.length > 0) {
      return res.status(401).json({
        error: "El nombre de usuario ya está en uso.",
      });
    }

    
    if (!role_id) {
      return res.status(401).json({
        error: "El rol es obligatorio.",
      });
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

    // Verificar si el correo ya existe
    if (user_email) {
      const emailCheck = await pool.query(
        "SELECT * FROM users WHERE user_email = $1 AND id != $2",
        [user_email, id]
      );
      if (emailCheck.rowCount > 0) {
        return res
          .status(401)
          .json({ error: "El correo electrónico ya está en uso." });
      }
      updates.push(`user_email = $${updates.length + 1}`);
      values.push(user_email);
    }

    // Verificar si la matrícula ya existe
    if (user_matricula) {
      const matriculaCheck = await pool.query(
        "SELECT * FROM users WHERE user_matricula = $1 AND id != $2",
        [user_matricula, id]
      );
      if (matriculaCheck.rowCount > 0) {
        return res
          .status(401)
          .json({ error: "La matrícula ya está en uso." });
      }

      if (!/^\d{9}$/.test(user_matricula)) {
        return res.status(401).json({
          error:
            "La matrícula debe ser numérica y tener exactamente 9 dígitos.",
        });
      }
      updates.push(`user_matricula = $${updates.length + 1}`);
      values.push(user_matricula);
    }

    // Verificar si el nombre de usuario ya existe
    if (user_name) {
      const nameCheck = await pool.query(
        "SELECT * FROM users WHERE user_name = $1 AND id != $2",
        [user_name, id]
      );
      if (nameCheck.rowCount > 0) {
        return res
          .status(401)
          .json({ error: "El nombre de usuario ya está en uso." });
      }

      if (user_name.length < 2) {
        return res
          .status(401)
          .json({ error: "El nombre debe tener al menos 2 caracteres." });
      }
      updates.push(`user_name = $${updates.length + 1}`);
      values.push(user_name);
    }

    // Validación para el rol
    if (role_id) {
      updates.push(`role_id = $${updates.length + 1}`);
      values.push(role_id);
    }

    if (updates.length === 0) {
      return res
        .status(401)
        .json({ error: "No hay campos para actualizar." });
    }

    // Añadir el ID del usuario al final de los valores para la consulta
    values.push(id);

    // Realizar la actualización en la base de datos
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length}`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito!" });
  } catch (err) {
    console.error(err.message);  // Cambié `err.error` a `err.message`
    res.status(500).send("Error del servidor");
  }
};


// Eliminar un usuario y validar que ninguna encuesta este enlazado a ese usuario caso contrario no se podra eleiminar

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const encuestas = await pool.query(
      "SELECT * FROM respuestas_encuesta WHERE user_id = $1",
      [id]
    );
    if (encuestas.rows.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "No se puede eliminar el usuario porque tiene encuestas asociadas",
        });
    }
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ error: "Usuario eliminado con éxito" });
  } catch (err) {
    console.error(err.error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
