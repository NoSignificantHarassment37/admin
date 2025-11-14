import { Router } from "express";
import {
  getAllPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "./permisos.controllers.js";

const router = Router();

router.get("/", getAllPermisos);
router.get("/:id", getPermisoById);
router.post("/", createPermiso);
router.patch("/:id", updatePermiso);
router.delete("/:id", deletePermiso);

export default router;
