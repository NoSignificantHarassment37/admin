// middlewares/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
export interface AuthRequest extends Request {
  usuario?: { id: number; email: string; rol: string };
}
interface JwtUsuario extends JwtPayload {
  id: number;
  email: string;
  rol: string;
}

export function authenticationMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;
  if (secret === undefined) {
    return res.status(500).json({ error: "Error interno en el servidor." });
  }
  if (token === undefined) {
    return res.status(403).json({ error: "Token indefinido." });
  }

  try {
    const decoded: string | JwtPayload = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("id" in decoded) ||
      !("email" in decoded) ||
      !("rol" in decoded)
    ) {
      return res.status(403).json({ error: "Token inválido" });
    }

    const payload = decoded as JwtUsuario;
    req.usuario = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    };

    next();
  } catch {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}
