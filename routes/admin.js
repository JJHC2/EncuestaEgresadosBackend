const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const userController = require("../controllers/UserController");
const checkPermission = require("../middleware/CheckPermission");
const EncuestaCrudController = require("../controllers/EncuestaCrudController");
const validInfo = require('../middleware/validInfo');

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



// Definición de permisos
const PERMISSION_MANAGE_USERS = 6; // Administrar usuarios (agregar, editar, eliminar)
const PERMISSION_GET_USERS = 5; // Solo obtener usuarios

// Ruta para obtener todos los usuarios
router.get("/users", authorization, checkPermission([PERMISSION_GET_USERS, PERMISSION_MANAGE_USERS]), userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get("/users/:id", authorization, checkPermission([PERMISSION_GET_USERS, PERMISSION_MANAGE_USERS]), userController.getUserById);

// Ruta para crear un usuario
router.post("/users", authorization,validInfo, checkPermission([PERMISSION_MANAGE_USERS]), userController.createUser);

// Ruta para actualizar un usuario
router.put("/users/:id", authorization,validInfo, checkPermission([PERMISSION_MANAGE_USERS]), userController.updateUser);

// Ruta para eliminar un usuario
router.delete("/users/:id", authorization, checkPermission([PERMISSION_MANAGE_USERS]), userController.deleteUser);

//ENDPOINTS ENCUESTA CRUD
router.get("/responses", authorization, EncuestaCrudController.GetResponses);
router.get("/responses/:userName", authorization, EncuestaCrudController.GetResponsesByUserName);
router.post("/deletesurveys", authorization, EncuestaCrudController.DeleteUserResponses);
router.get("/countjob", authorization, EncuestaCrudController.CountJob);
router.get("/jobdata", authorization, EncuestaCrudController.JobData);
router.get("/countresponses", authorization, EncuestaCrudController.CountResponses);
router.get("/countresponsebysection", authorization, EncuestaCrudController.SectionData);
router.get("/academica", authorization, EncuestaCrudController.SatisfaccionData);

module.exports = router;
