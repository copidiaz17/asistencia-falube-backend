// reset-admin.js — Resetea la contraseña del admin a 'admin123'
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { sequelize } from "./database.js";
import Usuario from "./models/Usuario.js";

async function resetAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const email = "admin@admin.com";
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      console.log(`❌ No existe usuario con email '${email}'. Creándolo...`);
      const hash = await bcrypt.hash("admin123", 10);
      await Usuario.create({ nombre: "Administrador", email, password: hash, rol: "ADMIN" });
      console.log(`✅ Usuario creado con contraseña 'admin123' y rol ADMIN`);
    } else {
      // Verificar si la contraseña actual ya funciona
      const match = await bcrypt.compare("admin123", user.password);
      if (match) {
        console.log(`✅ La contraseña 'admin123' ya es correcta para '${email}'`);
        console.log(`   Rol actual: ${user.rol}`);
      } else {
        const hash = await bcrypt.hash("admin123", 10);
        await user.update({ password: hash, rol: "ADMIN" });
        console.log(`✅ Contraseña de '${email}' restablecida a 'admin123' y rol actualizado a ADMIN`);
      }
    }
  } catch (err) {
    console.error("⛔ Error:", err.message);
  } finally {
    await sequelize.close();
  }
}

resetAdmin();
