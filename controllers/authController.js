const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Genera un token JWT para el usuario
 * @param {object} user - Instancia de usuario de Mongoose
 * @returns {string} Token JWT válido por 7 días
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      campus: user.campus,
      nombre: user.nombre,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * POST: Registrar un nuevo usuario
 * @param {object} req - Objeto de solicitud de Express
 * @param {object} res - Objeto de respuesta de Express
 */
exports.register = async (req, res) => {
  try {
    let { nombre, email, campus, contraseña } = req.body;

    if (!nombre || !email || !campus || !contraseña) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    email = email.trim().toLowerCase();

    // Validación: solo correos institucionales
    if (!email.endsWith("@itson.edu.mx")) {
      return res.status(400).json({ msg: "Solo correos institucionales." });
    }

    // Validación: usuario ya registrado
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Usuario ya registrado." });

    // Crear y guardar usuario
    const user = new User({ nombre, email, campus, contraseña });
    await user.save();

    // Generar token JWT
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

/**
 * POST: Login de usuario
 * @param {object} req - Objeto de solicitud de Express
 * @param {object} res - Objeto de respuesta de Express
 */
exports.login = async (req, res) => {
  try {
    let { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ msg: "Email y contraseña son requeridos." });
    }

    email = email.trim().toLowerCase();

    // Buscar usuario y traer la contraseña explícitamente
    const user = await User.findOne({ email }).select("+contraseña");
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas." });

    // Validar contraseña usando método del modelo
    const isMatch = await user.comparePassword(contraseña);
    if (!isMatch) return res.status(401).json({ msg: "Credenciales inválidas." });

    // Generar token JWT
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

/**
 * GET: Obtener perfil del usuario autenticado
 * @param {object} req - Objeto de solicitud de Express (req.user.id disponible)
 * @param {object} res - Objeto de respuesta de Express
 */
exports.profile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Token inválido o expirado." });
    }

    const user = await User.findById(req.user.id).select("-contraseña");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error en profile:", err);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};
