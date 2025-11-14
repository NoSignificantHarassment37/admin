import express from "express";
import {
  obtenerActividades,
  obtenerActividadPorId,
  obtenerActividadesPorItinerario,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "./actividades.controllers.js";

const router = express.Router();

router.get("/", obtenerActividades);
router.get("/:id", obtenerActividadPorId);
router.post("/", crearActividad);
router.patch("/:id", actualizarActividad);
router.delete("/:id", eliminarActividad);

export default router;
