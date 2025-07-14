const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token requerido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ msg: "Token inválido" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verificando token:", err.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
};
