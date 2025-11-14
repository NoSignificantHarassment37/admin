import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "./usuarios.controllers.js";
import { registerUsuario, generarJWT } from "../autenticacion/usuario.autenticacion.js";
const router = Router();

router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.patch("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
export default router;
