import express from "express";
import {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from "./servicios.controllers.js";

const router = express.Router();

router.get("/", obtenerServicios);
router.get("/:id", obtenerServicioPorId);
router.post("/", crearServicio);
router.patch("/:id", actualizarServicio);
router.delete("/:id", eliminarServicio);

export default router;
