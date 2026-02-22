// Script para crear el usuario administrador inicial
// Uso: node crear-admin.js
// Eliminar este archivo luego de usarlo

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from './database.js';
import Usuario from './models/Usuario.js';

const nombre = 'Administrador';
const email = 'admin@admin.com';
const password = 'admin123';
const rol = 'administrador';

try {
  await sequelize.authenticate();
  await Usuario.sync();

  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    console.log(`⚠️  Ya existe un usuario con el email: ${email}`);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({ nombre, email, password: hash, rol });

  console.log('✅ Usuario administrador creado exitosamente:');
  console.log(`   ID:       ${usuario.id}`);
  console.log(`   Nombre:   ${usuario.nombre}`);
  console.log(`   Email:    ${usuario.email}`);
  console.log(`   Rol:      ${usuario.rol}`);
  console.log(`   Password: ${password}`);
  console.log('\n⚠️  Cambia la contraseña luego de ingresar.');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await sequelize.close();
}
