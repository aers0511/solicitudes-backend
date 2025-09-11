const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
  cors({
    origin: "https://solicitudes-frontend.vercel.app", // tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // permitir Authorization
    credentials: true,
  })
);
app.options("*", cors());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}/api`));
  })
  .catch((error) => {
    console.error("Error conectando a MongoDB:", error);
  });
