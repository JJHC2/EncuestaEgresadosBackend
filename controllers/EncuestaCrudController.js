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

//Obtener respuestas por nombre del usuario
const GetResponsesByUserName = async (req, res) => {
  try {
    const { userName } = req.params;
    const responses = await pool.query(
      "SELECT r.seccion, r.pregunta, r.respuesta, u.user_name FROM users u INNER JOIN respuestas_encuesta r ON u.id = r.user_id WHERE u.user_name = $1",
      [userName]
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
      "select count(respuesta) from respuestas_encuesta WHERE pregunta = 'trabajas';"
    );

    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//Endpoint respuestas recibidas
const CountResponses = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT COUNT(*) FROM respuestas_encuesta;"
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

//Peticion para eliminar todas las encuestas asociadas a un usuario en especifico por su id
const DeleteUserResponses = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await pool.query(
      "DELETE FROM respuestas_encuesta WHERE user_id = $1",
      [userId]
    );
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//Peticion para grafica de barras de secciones de la encuesta
const SectionData = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT seccion, COUNT(seccion) FROM respuestas_encuesta GROUP BY seccion;"
    );
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};



//Ruta para obtener niveles de satisfaccion respecto a la academia
const SatisfaccionData = async (req, res) => {
  try {
    const query = `
      SELECT 
        pregunta,
        respuesta, 
        COUNT(*) AS total_respuestas
      FROM 
        respuestas_encuesta
      WHERE 
        seccion = 'academica'
        AND pregunta IN ('capacidadDocentes', 'docentesPostgrado', 'docentesExperiencia', 'contenidoTeoricos', 'desarrolloPracticas')
      GROUP BY 
        pregunta, respuesta
      ORDER BY 
        CASE 
          WHEN pregunta = 'capacidadDocentes' THEN 1
          WHEN pregunta = 'docentesPostgrado' THEN 2
          WHEN pregunta = 'docentesExperiencia' THEN 3
          WHEN pregunta = 'contenidoTeoricos' THEN 4
          WHEN pregunta = 'desarrolloPracticas' THEN 5
          ELSE 6
        END,
        CASE 
          WHEN respuesta = 'Insatisfactoria' THEN 1
          WHEN respuesta = 'Regular' THEN 2
          WHEN respuesta = 'Satisfactoria' THEN 3
          WHEN respuesta = 'Muy Satisfactoria' THEN 4
          ELSE 5
        END;
    `;
    
    
    const result = await pool.query(query);

   
    res.json(result.rows); 
  } catch (error) {
    console.error("Error ejecutando la consulta:", error);
    res.status(500).send("Error en la base de datos");
  }
}; 

module.exports = {
  DeleteUserResponses,
  SectionData,
  SatisfaccionData,
  GetResponses,
  GetResponsesByUserName,
  CountJob,
  JobData,
  CountResponses,
};
