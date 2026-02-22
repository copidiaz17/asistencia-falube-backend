// server.js — Sistema de Control de Asistencia
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { sequelize } from "./database.js";

// Modelos
import "./models/Usuario.js";
import "./models/Obra.js";
import "./models/Empleado.js";
import "./models/Asistencia.js";
import "./models/Associations.js";

// Rutas
import authRoutes from "./routes/auth.js";
import obrasRoutes from "./routes/obras.js";
import empleadosRoutes from "./routes/empleados.js";
import asistenciaRoutes from "./routes/asistencia.js";
import usuariosRoutes from "./routes/usuarios.js";
import estadisticasRoutes from "./routes/estadisticas.js";

const app = express();
const PORT = process.env.PORT || 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";
const allowedOrigins = [FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/obras", obrasRoutes);
app.use("/api/obras", empleadosRoutes);
app.use("/api/obras", asistenciaRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

app.get("/", (req, res) => {
  res.send("Servidor de Asistencia funcionando.");
});

app.use((err, req, res, next) => {
  console.error("⛔ ERROR EN EXPRESS ⛔", err);
  res.status(500).json({ message: "Error interno del servidor." });
});

process.stdin.resume();

process.on("uncaughtException", (err) => {
  console.error("⛔ uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("⛔ unhandledRejection:", reason);
});

if (!process.env.JWT_SECRET) {
  console.error("⛔ JWT_SECRET no está definido. El servidor no puede arrancar de forma segura.");
  process.exit(1);
}

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    return sequelize.authenticate();
  })
  .then(() => {
    console.log("✅ Conexión a la base de datos OK");
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("⛔ Error de conexión DB:", err);
    process.exit(1);
  });
