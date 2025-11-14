import { Router } from "express";
import { registerUsuario, generarJWT } from "../autenticacion/usuario.autenticacion.js";
const router = Router();

router.post("/register", registerUsuario);
router.post("/login", generarJWT);
export default router;
