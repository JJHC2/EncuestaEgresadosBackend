const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo"); 
const authorization = require("../middleware/authorization");

//Registro
router.post("/register", validInfo, async (req, res) => {
  try {
    
    const { name, email, password, matricula, role_id } = req.body;
    

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    const saltRounds = 10;
    const genSalt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, genSalt);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_matricula, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, bcryptPassword, matricula, role_id]
    );

    
    const token = jwtGenerator(newUser.rows[0].id);
    res.json({ token, role: newUser.rows[0].role_id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Login Route
router.post("/login", validInfo, async (req, res) => {
  try {
   
    const { email, password } = req.body;

 
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).send("Password or Email is incorrect");
    }

  
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).send("Password or Email is incorrect");
    }

    
    const token = jwtGenerator(user.rows[0].id);

    
    const roleId = user.rows[0].role_id;

    
    const response = {
      token,
      role: roleId,
      
      user: {
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
      },
    };

    if (roleId === 2) {
     
      return res.json({ ...response, redirect: "/dashboard" });
    } else if (roleId === 1 || roleId === 3 || roleId === 4) { 
      
      return res.json({ ...response, redirect: "/admin" });
    }

    return res.json({ ...response, redirect: "/home" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Private Routes
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
