const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true, lowercase: true },
  campus: String,
  contraseña: { type: String, select: false }, // No se incluye por defecto
  rol: { type: String, default: "user" }, // user/admin
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

UserSchema.methods.comparePassword = function (contraseña) {
  if (!this.contraseña) return Promise.resolve(false);
  return bcrypt.compare(contraseña, this.contraseña);
};

module.exports = mongoose.model("User", UserSchema);
