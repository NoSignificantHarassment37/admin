import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";
// =============================
// Obtener todos los roles
// =============================
/**
 * GET api/roles
 */
export async function getAllRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.rol.findMany({
      include: {
        usuario_creador: {
          select: { id: true, email: true },
        },
        permisos: true,
      },
    });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los roles" });
  }
}

// =============================
// Obtener un rol por ID
// =============================
/**
 * GET api/roles:id number(integer)
 */
export async function getRolById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const rol = await prisma.rol.findUnique({
      where: { id },
      include: {
        usuario_creador: {
          select: { id: true, email: true },
        },
        permisos: true,
      },
    });

    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el rol" });
  }
}

// =============================
// Crear un nuevo rol
// =============================
/**
 *
 * POST api/roles
 * {
 *  nombre:string,
 *  descripcion"string,
 *  estado:"inactivo" | "activo",
 *  usuario_creador_id?:number(int),
 *  permisos: es un array con los IDs de los permisos
 * }
 */
export async function createRol(req: Request, res: Response) {
  try {
    const { nombre, descripcion, estado, usuario_creador_id } = req.body;

    let permisos = req.body.permisos;
    if (typeof permisos === "string") permisos = [permisos];

    const permisosConnect: number[] = Array.isArray(permisos)
      ? permisos.map(Number).filter((id) => !isNaN(id))
      : [];

    if (permisosConnect.length === 0) {
      return res
        .status(422)
        .json({ error: "Debes seleccionar al menos un permiso" });
    }

    const data: any = {
      nombre,
      descripcion,
      estado,
      permisos: {
        connect: permisosConnect.map((id) => ({ id })),
      },
    };

    if (usuario_creador_id) {
      data.usuario_creador = {
        connect: { id: Number(usuario_creador_id) },
      };
    }

    const nuevoRol = await prisma.rol.create({
      data,
      include: { permisos: true },
    });

    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error("Error al crear el rol:", error);
    res
      .status(500)
      .json({ error: `No se pudo crear el rol: ${JSON.stringify(error)}` });
  }
}

// =============================
// Actualizar un rol
// =============================
/**
 *
 * PATCH api/roles/:id number(integer)
 * {
 *  nombre:string,
 *  descripcion:string,
 *  estado:"inactivo" | "activo",
 *  permisos_ids: Array<number(integer)>
 * }
 */
export async function updateRol(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, estado, permisos } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Normaliza `permisos`
    let permisosRaw = permisos;
    if (typeof permisosRaw === "string") permisosRaw = [permisosRaw];
    const permisosIds: number[] = Array.isArray(permisosRaw)
      ? permisosRaw.map(Number).filter((id) => !isNaN(id))
      : [];

    const data: any = {};
    if (nombre) data.nombre = nombre;
    if (descripcion) data.descripcion = descripcion;
    if (estado) data.estado = estado;

    // Si se enviaron permisos, actualiza la relación N:M
    if (permisosIds.length > 0) {
      data.permisos = {
        set: permisosIds.map((id) => ({ id })), // reemplaza todo
      };
    }

    const rolActualizado = await prisma.rol.update({
      where: { id },
      data,
      include: { permisos: true },
    });

    res.status(200).json(rolActualizado);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res
      .status(400)
      .json({ error: `No se pudo actualizar el rol: ${String(error)}` });
  }
}

// =============================
// Eliminar un rol
// =============================
/**
 * DELETE api/roles/:id number(integer)
 */
export async function deleteRol(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.status(422).json({error:"La url debe contener el id del elemento a eliminar."});
    }
    await prisma.rol.delete({ where: { id } });
    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al eliminar el rol" });
  }
}
