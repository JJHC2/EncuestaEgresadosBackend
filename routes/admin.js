const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const userController = require("../controllers/UserController");
const checkPermission = require("../middleware/CheckPermission");
const pdfkit = require("../libs/PDFkit.js");

//ID del permiso de administrador para gestionar usuarios
const PERMISSION_MANAGE_USERS = 6;



//Ruta Principal
router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name, role_id FROM users WHERE id = $1", 
      [req.user]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ruta para obtener todos los usuarios
router.get("/users", authorization, checkPermission(PERMISSION_MANAGE_USERS), userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get("/users/:id", authorization, checkPermission(PERMISSION_MANAGE_USERS), userController.getUserById);

// Ruta para crear un usuario
router.post("/users", authorization, checkPermission(PERMISSION_MANAGE_USERS), userController.createUser);

// Ruta para actualizar un usuario
router.put("/users/:id", authorization, checkPermission(PERMISSION_MANAGE_USERS), userController.updateUser);

// Ruta para eliminar un usuario
router.delete("/users/:id", authorization, checkPermission(PERMISSION_MANAGE_USERS), userController.deleteUser);

//Ruta para el PDF
router.get("/pdf", (req, res) => {

  const stream = res.writeHead(200,{
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=ReportesUsuarios.pdf'
  })
  pdfkit.buildPDF(
    (data) => {
      stream.write(data) 
    },
    () => {
      stream.end()
    }
  );

  res.send("PDF generado")
});



module.exports = router;