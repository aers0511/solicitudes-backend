const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  campus: String,
  password: { type: String, select: false }, // No se incluye por defecto
  role: { type: String, default: "user" }, // user/admin
  avatar: { type: String, default: null }, // ruta imagen opcional
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
