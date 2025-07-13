const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Registro con opción de subir avatar
router.post("/register", upload.single("avatar"), async (req, res) => {
  const { name, email, campus, password } = req.body;

  if (!email.endsWith("@itson.edu.mx")) {
    return res.status(400).json({ msg: "Correo institucional inválido" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "El correo ya está registrado" });

    const newUser = new User({
      name,
      email,
      campus,
      password,
      avatar: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newUser.save();

    const payload = { user: { id: newUser.id, email: newUser.email, role: newUser.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Correo o contraseña incorrectos" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Correo o contraseña incorrectos" });

    const payload = { user: { id: user.id, email: user.email, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// Obtener perfil usuario
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
