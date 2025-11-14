import type { Request, Response } from "express";
import { PrismaClient } from "../../../prisma/generated/client.js";
import { Router } from "express";
const prisma = new PrismaClient();

async function getRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.rol.findMany({ select: { nombre: true, id: true } });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error interno." });
  }
}
async function getPermisos(req: Request, res: Response) {
  try {
    const permisos = await prisma.permiso.findMany({
      select: {
        nombre: true,
        id: true
      }
    });
    res.status(200).json(permisos);
  }
  catch (e) {
    res.status(500).json({ error: "Error interno." });
  }
}
async function getPaquetes(req: Request, res: Response) {
  try {
    const paquetes = await prisma.paquete_turistico.findMany({ select: { nombre: true, id: true } });
    res.status(200).json(paquetes);
  }
  catch (e) {
    res.status(500).json({ error: "Error interno." });
  }
}
async function getActividades(req: Request, res: Response) {
  try {
    const actividades = await prisma.actividad.findMany({
      select: {
        nombre: true,
        id: true
      }
    });
    res.status(200).json(actividades);
  } catch (e) {
    res.status(500).json({ error: "Error interno." });
  }
}
const routes = Router();
routes.get('/permisos', getPermisos);
routes.get('/roles', getRoles);
routes.get('/paquetes-turisticos', getPaquetes);
routes.get('/actividades', getActividades);
export default routes;