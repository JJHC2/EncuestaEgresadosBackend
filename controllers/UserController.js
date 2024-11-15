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
  const { user_name, user_email, user_password, user_matricula, role_id } =
    req.body;
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_email = $1 OR user_matricula = $2",
      [user_email, user_matricula]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "El usuario ya existe con ese correo electrónico o matrícula.",
      });
    }

    //Validar el nombre no tenga espacios

    if(user_name.includes(" ")){
      return res.status(400).json({ message: "El nombre de usuario no puede contener espacios." });
    }


    // Validar que la matrícula sea numérica y tenga 9 dígitos
    if (!/^\d{9}$/.test(user_matricula)) {
      return res.status(400).json({
        message:
          "La matrícula debe ser numérica y tener exactamente 9 dígitos.",
      });
    }

    // Validar que la contraseña tenga entre 2 y 15 caracteres
    if (user_password.length < 2 || user_password.length > 15) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener entre 2 y 15 caracteres." });
    }

    // Validar que el nombre tenga más de 2 caracteres
    if (user_name.length < 2) {
      return res
        .status(400)
        .json({ message: "El nombre debe tener más de 2 caracteres." });
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
          .status(400)
          .json({ message: "El correo electrónico ya está en uso." });
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
          .status(400)
          .json({ message: "La matrícula ya está en uso." });
      }

      if (!/^\d{9}$/.test(user_matricula)) {
        return res.status(400).json({
          message:
            "La matrícula debe ser numérica y tener exactamente 9 dígitos.",
        });
      }
      updates.push(`user_matricula = $${updates.length + 1}`);
      values.push(user_matricula);
    }

    // Validación para el nombre
    if (user_name) {
      if (user_name.length < 2) {
        return res
          .status(400)
          .json({ message: "El nombre debe tener al menos 2 caracteres." });
      }
      updates.push(`user_name = $${updates.length + 1}`);
      values.push(user_name);
    }

    if (user_name) {
      const userNameCheck = await pool.query(
        "SELECT * FROM users WHERE user_name = $1 AND id != $2",
        [user_name, id]
      );
      if (userNameCheck.rowCount > 0) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario ya está en uso." });
      }
      updates.push(`user_name = $${updates.length + 1}`);
      values.push(user_name);
    }

    if (user_name.includes(" ")) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario no puede contener espacios." });
    }

    // Validación para el rol
    if (role_id) {
      updates.push(`role_id = $${updates.length + 1}`);
      values.push(role_id);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay campos para actualizar." });
    }

    // Añadir el ID del usuario al final de los valores para la consulta
    values.push(id);

    // Realizar la actualización en la base de datos
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length}`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Eliminar un usuario y validar que ninguna encuesta este enlazado a ese usuario caso contrario no se podra eleiminar

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const encuestas = await pool.query(
      "SELECT * FROM respuestas_encuesta WHERE user_id = $1",
      [id]
    );
    if (encuestas.rows.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "No se puede eliminar el usuario porque tiene encuestas asociadas",
        });
    }
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
