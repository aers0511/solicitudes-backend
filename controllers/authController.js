const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const path = require("path");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      campus: user.campus,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    let { name, email, campus, password } = req.body;

    email = email.trim().toLowerCase();

    if (!email.endsWith("@itson.edu.mx")) {
      return res.status(400).json({ msg: "Solo correos institucionales." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Ya registrado." });

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const user = new User({
      name,
      email,
      campus,
      password,
      avatar,
    });

    await user.save();

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en registro" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Correo invalido" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Contraseña invalida" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en login" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo perfil" });
  }
};
