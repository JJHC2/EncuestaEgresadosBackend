const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const userController = require("../controllers/UserController");
const checkPermission = require("../middleware/CheckPermission");
const EncuestaCrudController = require("../controllers/EncuestaCrudController");

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


//ENDPOINTS ENCUESTA CRUD
router.get("/responses", authorization, EncuestaCrudController.GetResponses);
router.get("/responses/:id", authorization, EncuestaCrudController.GetResponsesById);
router.get("/countjob", authorization, EncuestaCrudController.CountJob);
router.get("/jobdata", authorization, EncuestaCrudController.JobData);

module.exports = router;