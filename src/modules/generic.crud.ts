import type { Request, Response } from "express";
import { PrismaClient } from "../../prisma/generated/client.js";

/**
 * Opciones para crear controladores genéricos CRUD.
 * - include: objeto para pasar a las consultas `findMany`/`findUnique`/etc.
 * - createAllowed/updateAllowed: lista de campos permitidos para crear/actualizar (si se omite, se usa todo `req.body`).
 *
 * Notas/Asunciones:
 * - El modelo tiene un campo `id` numérico como PK. Si tu PK tiene otro nombre o tipo,
 *   puedes ajustar las llamadas `where: { id: Number(id) }` o pasar un `idField` en options.
 * - Se asume que la validación (Zod/u otra) ya se ejecutó antes de llegar a los controladores.
 */
export type GenericCrudOptions = {
  include?: any;
  createAllowed?: string[];
  updateAllowed?: string[];
  idField?: string; // por defecto 'id'
};

function pick(obj: any, keys?: string[]) {
  if (!keys) return obj;
  const out: any = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

export function createGenericCrud(prisma: PrismaClient, modelName: string, opts: GenericCrudOptions = {}) {
  const idField = opts.idField || "id";

  async function list(req: Request, res: Response) {
    try {
      const items = await (prisma as any)[modelName].findMany({
        ...(opts.include ? { include: opts.include } : {}),
      });
      res.json(items);
    } catch (error: any) {
      console.error(`Error listing ${modelName}:`, error);
      res.status(500).json({ error: `Error al obtener ${modelName}`, detalle: String(error) });
    }
  }

  async function getById(req: Request, res: Response) {
    try {
      const idRaw = req.params[idField] ?? req.params.id;
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const where = { [idField]: id } as any;

      const item = await (prisma as any)[modelName].findUnique({
        where,
        ...(opts.include ? { include: opts.include } : {}),
      });
      if (!item) return res.status(404).json({ error: `${modelName} no encontrado` });
      res.json(item);
    } catch (error: any) {
      console.error(`Error getting ${modelName} by id:`, error);
      res.status(500).json({ error: `Error al obtener ${modelName}`, detalle: String(error) });
    }
  }

  async function create(req: Request, res: Response) {
    try {
      const data = pick(req.body, opts.createAllowed);
      const created = await (prisma as any)[modelName].create({
        data,
        ...(opts.include ? { include: opts.include } : {}),
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error(`Error creating ${modelName}:`, error);
      res.status(500).json({ error: `Error al crear ${modelName}`, detalle: String(error) });
    }
  }

  async function update(req: Request, res: Response) {
    try {
      const idRaw = req.params[idField] ?? req.params.id;
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const where = { [idField]: id } as any;
      const data = pick(req.body, opts.updateAllowed);

      const updated = await (prisma as any)[modelName].update({
        where,
        data,
        ...(opts.include ? { include: opts.include } : {}),
      });
      res.json(updated);
    } catch (error: any) {
      console.error(`Error updating ${modelName}:`, error);
      res.status(500).json({ error: `Error al actualizar ${modelName}`, detalle: String(error) });
    }
  }

  async function remove(req: Request, res: Response) {
    try {
      const idRaw = req.params[idField] ?? req.params.id;
      const id = isNaN(Number(idRaw)) ? idRaw : Number(idRaw);
      const where = { [idField]: id } as any;

      await (prisma as any)[modelName].delete({ where });
      res.json({ mensaje: `${modelName} eliminado correctamente` });
    } catch (error: any) {
      console.error(`Error deleting ${modelName}:`, error);
      res.status(500).json({ error: `Error al eliminar ${modelName}`, detalle: String(error) });
    }
  }

  return {
    list,
    getById,
    create,
    update,
    delete: remove,
  };
}

export default createGenericCrud;
