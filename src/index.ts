// src/index.ts
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// ----------------------
// Prisma Client
// ----------------------
const prisma = new PrismaClient();

// ----------------------
// AdminJS setup
// ----------------------
AdminJS.registerAdapter({ Database, Resource });

const adminJs = new AdminJS({
  resources: [
    { resource: { model: getModelByName('User'), client: prisma }, options: {} },
    { resource: { model: getModelByName('Post'), client: prisma }, options: {} },
  ],
  rootPath: '/admin',
  branding: { companyName: 'Viajes Nova' },
});

// ----------------------
// Express app
// ----------------------
const app = express();

// AdminJS router
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

// Ruta pública de prueba
app.get('/', (req, res) => res.send('Servidor corriendo 🚀'));

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`AdminJS disponible en http://localhost:${PORT}${adminJs.options.rootPath}`);
});
