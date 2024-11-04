const express = require("express");
const pool = require("../db");

//API para almacenar las respuestas de la encuesta
const Respuestas = async (req, res) => {
  const user_id = req.user;
  const formData = req.body;
  for (const [seccion, preguntas] of Object.entries(formData)) {
    for (const [pregunta, respuesta] of Object.entries(preguntas)) {
      await pool.query(
        "INSERT INTO respuestas_encuesta (user_id, seccion, pregunta, respuesta) VALUES ($1, $2, $3, $4)",
        [user_id, seccion, pregunta, respuesta]
      );
    }
  }
  return res.status(200).json({ message: "Encuesta enviada con éxito." });
};

//API para verificar si el usuario ya ha respondido la encuesta
const CheckResponse = async (req, res) => {
  const user_id = req.user;

  try {
    const existingResponse = await pool.query(
      "SELECT * FROM respuestas_encuesta WHERE user_id = $1",
      [user_id]
    );

    if (existingResponse.rows.length > 0) {
      return res.status(200).json({ responded: true });
    }

    return res.status(200).json({ responded: false });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


//Api para obtener el listado de respuestas de la encuesta


module.exports = {
  Respuestas,
  CheckResponse
};
