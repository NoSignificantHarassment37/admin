import { Router } from "express";
import {
  getPaqueteById,
  getAllPaquetes,
  createPaquete,
  updatePaquete,
  deletePaquete,
} from "./paquetes.controllers.js";

const router = Router();

router.get("/", getAllPaquetes);
router.get("/:id", getPaqueteById);
router.post("/", createPaquete);
router.patch("/:id", updatePaquete);
router.delete("/:id", deletePaquete);

export default router;
