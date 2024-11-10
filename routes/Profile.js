const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadDirectory = path.join(__dirname, '..', 'libs', 'uploads', 'profile_pictures');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

// Ruta para obtener el perfil
router.get("/", authorization, async (req, res) => {
  const user_id = req.user;
  if (!user_id) {
    return res.status(400).json({ message: "Usuario no autenticado." });
  }

  try {
    const result = await pool.query(
      `SELECT u.id AS user_id, u.user_name, u.user_email, 
            p.profile_picture, p.bio, p.phone_number, p.address, 
            p.birth_date, p.job_position, p.status, p.membership_date, 
            p.last_login, p.created_at, p.updated_at
            FROM user_profile p
            INNER JOIN users u ON u.id = p.user_id
            WHERE p.user_id = $1;`,
      [user_id]
    );
    if (result.rows.length === 0) {
      const defaultProfile = {
        profile_picture: "",
        bio: "",
        phone_number: "",
        address: "",
        birth_date: null,
        job_position: "",
        status: "activo",
        membership_date: new Date(),
        last_login: new Date(),
      };

      await pool.query(
        `INSERT INTO user_profile (user_id, profile_picture, bio, phone_number, address, birth_date, job_position, status, membership_date, last_login)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user_id,
          defaultProfile.profile_picture,
          defaultProfile.bio,
          defaultProfile.phone_number,
          defaultProfile.address,
          defaultProfile.birth_date,
          defaultProfile.job_position,
          defaultProfile.status,
          defaultProfile.membership_date,
          defaultProfile.last_login,
        ]
      );

      return res
        .status(201)
        .json({ message: "Perfil creado por defecto", ...defaultProfile });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ruta para actualizar el perfil
router.put('/profile-update', authorization, upload.single('profile_picture'), async (req, res) => {
  const userId = req.user.id;
  const { bio, phone_number, address, birth_date, job_position, status } = req.body;

  try {
    // Buscar al usuario por ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Actualizar los campos del perfil
    if (bio) user.bio = bio;
    if (phone_number) user.phone_number = phone_number;
    if (address) user.address = address;
    if (birth_date) user.birth_date = birth_date;
    if (job_position) user.job_position = job_position;
    if (status) user.status = status;

    // Si se sube una nueva imagen, actualizamos la ruta
    if (req.file) {
      const imageUrl = `/uploads/profile_pictures/${req.file.filename}`; // La ruta donde se almacenará la imagen
      user.profile_picture = imageUrl;  
    }

    await user.save(); // Guardar los cambios

    return res.status(200).json(user); // Responder con los datos actualizados
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar perfil." });
  }
});

module.exports = router;
