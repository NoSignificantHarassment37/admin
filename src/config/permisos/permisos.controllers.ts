import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

// Obtener todos los permisos
// GET api/roles
export async function getAllPermisos(req: Request, res: Response) {
  try {
    const permisos = await prisma.permiso.findMany({
      select: {
        id:true,
        nombre:true,
        descripcion:true,
        estado:true,
        usuario_creador: {
          select: { id: true, email: true },
        },
      }
    });
    res.json(permisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los permisos" });
  }
}

// Obtener permiso por ID
// GET /api/roles/:id
export async function getPermisoById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const permiso = await prisma.permiso.findUnique({
      where: { id },
      include: {
        roles: true,
        usuario_creador: {
          select: { id: true, email: true },
        },
      },
    });

    if (!permiso) {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }

    res.json(permiso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el permiso" });
  }
}

// Crear nuevo permiso
/**
 * 
 * POST api/roles
 * {
 *  nombre:string,
 *  descripcion:string,
 * }
 */
export async function createPermiso(req: Request, res: Response) {
  try {
    const { nombre, descripcion } = req.body;

    const nuevoPermiso = await prisma.permiso.create({
      data: {
        nombre,
        descripcion
      },
    });

    res.status(201).json(nuevoPermiso);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Error al crear el permiso:${error}` });
  }
}

// Actualizar permiso
/**
 * 
 * PATCH api/roles/:id number(integer)
 * {
 *  nombre:string,
 *  descripcion:string,
 *  estado: "activo" | "inactivo"
 * }
 */
export async function updatePermiso(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, estado } = req.body;

    const permisoActualizado = await prisma.permiso.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        estado,
      },
    });

    res.json(permisoActualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar el permiso" });
  }
}

// Eliminar permiso
/**
 * 
 * DELETE api/roles/:id number(integer)
 */
export async function deletePermiso(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.permiso.delete({ where: { id } });
    res.json({ message: "Permiso eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al eliminar el permiso" });
  }
}
