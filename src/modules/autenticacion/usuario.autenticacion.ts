import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../database/prisma.js";
/*
DTO:
{
email:string,
contrasena:string
}
 */
export async function registerUsuario(req: Request, res: Response) {
  try {
    const { email, contrasena } = req.body;
    // Evita usuarios duplicados
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Hasheamos la contraseña
    const hashed = await bcrypt.hash(contrasena, 10);
    const rol = await prisma.rol.findFirst({
      where:{
        nombre:'Usuario'
      }
    });
    if(!rol){
      return res.status(500).json({error:"error interno."})
    }
    // Creamos el usuario
    const usuario = await prisma.usuario.create({
      data: {
        email,
        contrasena: hashed,
        rol:{
          connect:{ id:rol.id }
        }
      },
    });

    res.status(201).json({ message: "Usuario registrado con éxito", usuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
/*
DTO:
{
email:string,
contrasena:string
}
 */
export async function generarJWT(req: Request, res: Response) {
  try {
    const { email, contrasena } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { rol:true }
    });
    if (usuario === null) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    if(usuario.rol === null){
      return res.status(500).json({error:"No se ha encontrado el rol."});
    }
    // Comparamos contraseñas
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_SECRET no está definido en las variables de entorno"
      );
    }
    // Generar el jwt
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol:usuario.rol.nombre }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        email: usuario.email,
        rol:usuario.rol.nombre
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
