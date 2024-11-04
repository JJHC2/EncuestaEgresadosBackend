const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const EncuestaController = require("../controllers/EncuestaController");
// Define la ruta para obtener el dashboard
router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT user_name FROM users WHERE id = $1", [req.user]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


//Rutas para almacenar la encuesta
router.post("/encuesta", authorization, EncuestaController.Respuestas);
router.get("/encuesta/check", authorization, EncuestaController.CheckResponse);

module.exports = router;
