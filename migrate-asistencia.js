// migrate-asistencia.js
// Ejecutar UNA SOLA VEZ con: node migrate-asistencia.js
// Agrega las columnas horario_ingreso, horario_salida y observacion a la tabla asistencias

import { sequelize } from "./database.js";

async function addColumnIfNotExists(tableName, columnName, columnDef) {
  const [rows] = await sequelize.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = '${tableName}'
      AND COLUMN_NAME = '${columnName}'
  `);

  if (rows.length > 0) {
    console.log(`  → Columna '${columnName}' ya existe, se omite.`);
    return;
  }

  await sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`);
  console.log(`  ✅ Columna '${columnName}' agregada.`);
}

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos OK");
    console.log("Ejecutando migración en tabla 'asistencias'...");

    await addColumnIfNotExists("asistencias", "horario_ingreso", "TIME NULL");
    await addColumnIfNotExists("asistencias", "horario_salida",  "TIME NULL");
    await addColumnIfNotExists("asistencias", "observacion",     "TEXT NULL");

    console.log("✅ Migración completada correctamente.");
  } catch (err) {
    console.error("⛔ Error en la migración:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
