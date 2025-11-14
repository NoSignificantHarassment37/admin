import express from "express";
import permisoRoutes from "./config/permisos/permisos.routes.js";
import rolRoutes from "./config/roles/roles.routes.js";
import usuarioRoutes from "./modules/usuarios/usuarios.routes.js";
import cors from 'cors';
import morgan from 'morgan';
import paquetesRoutes from './modules/paquetes-turisticos/paquetes.routes.js';
import itinerariosRoutes from './modules/itinerarios/itinerarios.routes.js';
import actividadesRoutes from './modules/actividades/actividades.routes.js';
import { authenticationMiddleware } from "./modules/autenticacion/autenticacion.middleware.js";
import { autorizationMiddleware } from "./modules/autenticacion/autorizacion.middleware.js";
import authRoutes from './modules/autenticacion/auth.routes.js';
import publicRoles from './config/roles/roles.public.js';
import reservasRoutes from './modules/reservas/reservas.routes.js';
import serviciosRoutes from './modules/servicios/servicios.routes.js';
import { prisma } from "./database/prisma.js";
// La funcion de abajo se encarga de inicializar en caso de ausencia, las funciones BASICAS de la aplicacion.
/*
lo que hace exactamente:
si no hay un permiso para el modulo de roles y permisos, lo crea.
si no hay roles 'usuarios' ni 'administrador' los crea y les asigna los permisos anteriores.
si no hay una usuario basico para administracion, lo crea y le asigna unas credenciales inventadas. 
 */
// de momento voy a dejar esta funcion aqui tirada, en el futuro tengo planeado crear una inicializacion del sistema mas robusta.
(async () => {
  // programar cierre de la conexion a supabase al cerrarse la app.
  process.once('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  process.once('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })

  let permisos = await prisma.permiso.findFirst({
    where: {
      nombre: 'permisos'
    }
  });
  if (!(permisos)) {
    permisos = await prisma.permiso.create({
      data: {
        nombre: 'permisos',
        estado: 'activo',
        fecha_registro: new Date(),
        descripcion: 'NN'
      }
    })
  }
  let roles = await prisma.permiso.findFirst({
    where: {
      nombre: 'roles'
    }
  });
  if (!(roles)) {
    roles = await prisma.permiso.create({
      data: {
        nombre: 'roles',
        estado: 'activo',
        fecha_registro: new Date(),
        descripcion: 'NN'
      }
    })
  }
  const userRol = await prisma.rol.findFirst({
    where: {
      nombre: 'Usuario'
    }
  });
  if (!(userRol)) {
    await prisma.rol.create({
      data: {
        nombre: 'Usuario',
        estado: 'activo',
        fecha_registro: new Date(),
        descripcion: 'NN'
      }
    })
  }
  let adminRol = await prisma.rol.findFirst({
    where: {
      nombre: 'Administrador'
    }
  });
  if (!(adminRol)) {
    adminRol = await prisma.rol.create({
      data: {
        permisos: {
          connect: [
            { id: permisos.id },
            { id: roles.id }
          ]
        },
        nombre: 'Administrador',
        estado: 'activo',
        fecha_registro: new Date(),
        descripcion: 'NN'
      }
    })
  }
  const adminUser = await prisma.usuario.findFirst({
    where:{
      email:"admin@gmail.com"
    }
  })
  if(!adminUser){
    await prisma.usuario.create({
      data:{
        email:"admin@gmail.com",
        contrasena:"$2a$10$S33eJKiu.beEZuz/T5WEtebcxlH/kXQH4TOfUcVI45N2VEe1Lrb5q",
        rol:{
          connect:{
            id:adminRol.id
          }
        }
      }
    })
  }
})()
const app = express();
app.use(cors()); // Permite solicitudes desde cualquier origen (útil para desarrollo)
app.use(morgan("dev")); // Loguea las peticiones en consola
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/public", publicRoles);
app.use("/api/roles", authenticationMiddleware, autorizationMiddleware("roles"), rolRoutes);
app.use("/api/permisos", authenticationMiddleware, autorizationMiddleware("permisos"), permisoRoutes);
app.use("/api/usuarios", authenticationMiddleware, autorizationMiddleware("usuarios"), usuarioRoutes);
app.use("/api/paquetes-turisticos", authenticationMiddleware, autorizationMiddleware("paquetes_turisticos"), paquetesRoutes);
app.use("/api/itinerarios", authenticationMiddleware, autorizationMiddleware("itinerarios"), itinerariosRoutes);
app.use("/api/actividades", authenticationMiddleware, autorizationMiddleware("actividades"), actividadesRoutes);
app.use("/api/reservas", authenticationMiddleware, autorizationMiddleware("reservas"), reservasRoutes);
app.use("/api/servicios", authenticationMiddleware, autorizationMiddleware("servicios"), serviciosRoutes);
// Servidor
const PORT = Number(process.env.PORT) || 3000;

const HOST:string = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
