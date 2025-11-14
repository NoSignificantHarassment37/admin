// middlewares/autorizar.ts
import type { Response, NextFunction } from "express";
import { prisma } from "../../database/prisma.js";
import type { AuthRequest } from "./autenticacion.middleware.js";

export function autorizationMiddleware(modulo: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const userRol = req.usuario.rol;
      if (!userRol) {
        return res.status(403).json({ error: "Rol no asignado" });
      }

      // Consulta si el rol tiene el permiso para ese módulo
      const rol = await prisma.rol.findFirst({
        where: {
          AND: [
            { nombre: req.usuario.rol },
            { permisos: { some: { nombre: modulo } } },
          ],
        },
        include: {
          permisos: true,
        },
      });
      if (!rol) {
        return res
          .status(403)
          .json({ error: `Acceso denegado al módulo: ${modulo}` });
      }

      next();
    } catch (error) {
      console.error("Error en autorización:", error);
      res.status(500).json({ error: "Error interno en autorización" });
    }
  };
}
