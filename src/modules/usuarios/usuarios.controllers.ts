import { connect } from "http2";
import { prisma } from '../../database/prisma.js'
import type { Request, Response } from "express";

// ===============================
// ✅ OBTENER TODOS LOS USUARIOS
// ===============================
// GET api/usuarios
export async function getUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: {
          select: {
            id: true,
            nombre: true
          }
        },
        roles_creados: false,
        permisos_creados: false,
      }
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// ===============================
// ✅ OBTENER USUARIO POR ID
// ===============================
/**
 * GET api/usuarios:id number(integer)
 */
export async function getUsuarioById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        rol: true,
        roles_creados: true,
        permisos_creados: true,
      },
    });
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

// ===============================
// ✅ CREAR USUARIO
// ===============================
/**
 * POST api/usuarios
 * {
 *    email:string,
 *    rol_id:number(integer)
 *    contrasena:string
 * }
 */
export async function createUsuario(req: Request, res: Response) {
  try {
    const { email, contrasena, rol } = req.body;
    if (Number.isNaN(rol)) {
      return res
        .status(422)
        .json({ error: "El rol no es un int." });
    }
    if (!email)
      return res.status(400).json({ error: "El email es obligatorio" });
    if (!contrasena)
      return res.status(400).json({ error: "La contraseña es obligatoria." });
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        contrasena,
        email,
        rol: {
          connect: { id: rol },
        },
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "El email o rol ya están en uso" });
    }
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// ===============================
// ✅ ACTUALIZAR USUARIO
// ===============================
/**
 * PATCH api/usuarios:id number(integer)
 * {
 *  rol:string
 *  contrasena:string
 * }
 */
export async function updateUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(403).json({ error: "ID en URL invalido." });
    }
    const { contrasena, rol } = req.body;
    const data: any = {};
    if (contrasena) {
      data.contrasena = contrasena;
    }
    if (rol) {
      data.rol = {
        disconnect: true,
        connect: { id: rol }
      }
    }
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: id },
      data,
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

// ===============================
// ✅ ELIMINAR USUARIO
// ===============================
// DELETE api/usuarios/:id number(integer)
export async function deleteUsuario(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}
