import type { Request, Response } from "express";
import { prisma } from '../../database/prisma.js' 
import { fechaISO8601Schema } from "../validation/date.schema.js";
// 🟢 Obtener todos los paquetes
// GET /api/paquetes
export async function getAllPaquetes(req: Request, res: Response) {
  try {
    const paquetes = await prisma.paquete_turistico.findMany({
      include: {
        itinerarios: {
          include: {
            actividades: true,
          },
        },
        servicios: {
          include: {
            servicio: true, // incluir datos del servicio real
          },
        },
      },
    });
    res.json(paquetes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los paquetes turísticos" });
  }
}

// 🟡 Obtener un paquete por ID
// GET /api/paquetes/:id
export async function getPaqueteById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const paquete = await prisma.paquete_turistico.findUnique({
      where: { id },
      include: {
        itinerarios: {
          include: {
            actividades: true,
          },
        },
        servicios: {
          include: {
            servicio: true,
          },
        },
      },
    });

    if (!paquete) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    res.json(paquete);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar el paquete" });
  }
}

// 🔵 Crear un nuevo paquete
/**
 * POST /api/paquetes
 * {
 *  nombre: string,
 *  descripcion?: string,
 *  precio_total: number,
 *  duracion_dias: number,
 *  fecha_inicio: string (ISO 8601),
 *  fecha_fin: string (ISO 8601),
 *  serviciosIds?: number[] // IDs de servicios opcionales
 * }
 */
export async function createPaquete(req: Request, res: Response) {
  try {
    const {
      nombre,
      descripcion,
      precio_total,
      duracion_dias,
      fecha_inicio,
      fecha_fin,
      estado
    } = req.body;
    const fechaFinParseResult = fechaISO8601Schema.safeParse(fecha_fin);
    if(!(fechaFinParseResult.success)){
      return res.status(422).json(fechaFinParseResult.error);
    }
    const fechaInicioParseResult = fechaISO8601Schema.safeParse(fecha_inicio);
    if(!(fechaInicioParseResult.success)){
      return res.status(422).json(fechaInicioParseResult.error);
    }
    const nuevoPaquete = await prisma.paquete_turistico.create({
      data: {
        estado,
        nombre,
        descripcion,
        precio_total,
        duracion_dias,
        fecha_inicio:fechaInicioParseResult.data,
        fecha_fin:fechaFinParseResult.data,
        creado_en: new Date()
      },
      include: {
        servicios: {
          include: { servicio: true },
        },
      },
    });
    /**const nuevoPaquete = await prisma.paquete_turistico.create({
      data: {
        estado,
        nombre,
        descripcion,
        precio_total,
        duracion_dias,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        servicios: {
          create: serviciosIds.map((servicioId: number) => ({
            servicio: { connect: { id: servicioId } },
          })),
        },
      },
      include: {
        servicios: {
          include: { servicio: true },
        },
      },
    }); */

    res.status(201).json(nuevoPaquete);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear el paquete turístico" });
  }
}

// 🟠 Actualizar paquete
/**
 * PATCH /api/paquetes/:id
 * {
 *  nombre?: string,
 *  descripcion?: string,
 *  precio_total?: number,
 *  duracion_dias?: number,
 *  fecha_inicio?: string (ISO),
 *  fecha_fin?: string (ISO)
 * }
 */
export async function updatePaquete(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const d = req.body;
    let data;
    if(req.body.descripcion){
      data = { nombre:d.nombre, precio_total:d.precio_total, duracion_dias:d.duracion_dias, fecha_inicio:new Date(d.fecha_inicio), fecha_fin:new Date(d.fecha_fin), descripcion:d.descripcion };
      console.log(data.fecha_fin);
      console.log(data.fecha_inicio);
    }
    else{
      data = { nombre:d.nombre, precio_total:d.precio_total, duracion_dias:d.duracion_dias, fecha_inicio:new Date(d.fecha_inicio), fecha_fin:new Date(d.fecha_fin) };
    }
    const paqueteActualizado = await prisma.paquete_turistico.update({
      where: { id },
      data,
    });

    res.json(paqueteActualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar el paquete" });
  }
}

// 🔴 Eliminar paquete
// DELETE /api/paquetes/:id
export async function deletePaquete(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.paquete_turistico.delete({ where: { id } });
    res.json({ message: "Paquete eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al eliminar el paquete" });
  }
}
