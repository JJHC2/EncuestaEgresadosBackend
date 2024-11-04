const express = require("express");
const pool = require("../db");

//Endpoint para obtener todas las encuestas
const GetResponses = async (req, res) => {
  try {
    const responses = await pool.query(
      "SELECT r.seccion,r.pregunta,r.respuesta,u.user_name FROM users u INNER JOIN respuestas_encuesta r ON u.id = r.user_id"
    );
    res.json(responses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//Obtener respuestas por id del usuario
const GetResponsesById = async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await pool.query(
      "SELECT r.seccion,r.pregunta,r.respuesta,u.user_name FROM users u INNER JOIN respuestas_encuesta r ON u.id = r.user_id WHERE u.id = $1",
      [id]
    );
    res.json(responses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//Contar usuarios si trabajan o no
const CountJob = async (req, res) => {
  try {
    const response = await pool.query(
      "select count(respuesta) from respuestas_encuesta WHERE pregunta = 'trabajas' AND respuesta = 'Si';"
    );

    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


//Peticion para la grafica de trabajo 
const JobData = async (req, res) => {
    try {
      const responseYes = await pool.query(
        "SELECT COUNT(respuesta) FROM respuestas_encuesta WHERE pregunta = 'trabajas' AND respuesta = 'Si';"
      );
      const responseNo = await pool.query(
        "SELECT COUNT(respuesta) FROM respuestas_encuesta WHERE pregunta = 'trabajas' AND respuesta = 'No';"
      );
  
      res.json({
        yes: responseYes.rows[0].count,
        no: responseNo.rows[0].count,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };
module.exports = {
  GetResponses,
  GetResponsesById,
  CountJob,
  JobData
};
