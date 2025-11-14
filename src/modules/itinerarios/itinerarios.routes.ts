import express from "express";
import {
  obtenerItinerarios,
  obtenerItinerarioPorId,
  crearItinerario,
  actualizarItinerario,
  eliminarItinerario,
} from "./itinerarios.controllers.js";

const router = express.Router();

router.get("/", obtenerItinerarios);
router.get("/:id", obtenerItinerarioPorId);
router.post("/", crearItinerario);
router.patch("/:id", actualizarItinerario);
router.delete("/:id", eliminarItinerario);

export default router;
