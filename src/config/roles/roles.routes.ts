import { Router } from "express";
import {
  getAllRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
} from "./roles.controller.js";

const router = Router();

router.get("/", getAllRoles);
router.get("/:id", getRolById);
router.post("/", createRol);
router.patch("/:id", updateRol);
router.delete("/:id", deleteRol);

export default router;
