import { prisma } from "../../database/prisma.js";
import type { Response, Request } from 'express';
// ===============================
// OBTENER TODAS LAS ACTIVIDADES
// ===============================
export async function obtenerActividades(req:Request, res:Response) {
  try {
    const actividades = await prisma.actividad.findMany({
      include: {
        itinerario: true,
      },
    });
    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// OBTENER UNA ACTIVIDAD POR ID
// ===============================
export async function obtenerActividadPorId(req:Request, res:Response) {
  const { id } = req.params;

  try {
    const actividad = await prisma.actividad.findUnique({
      where: { id: Number(id) },
      include: { itinerario: true },
    });

    if (!actividad) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }

    res.json(actividad);
  } catch (error) {
    console.error("Error al obtener actividad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// OBTENER ACTIVIDADES DE UN ITINERARIO
// ===============================
export async function obtenerActividadesPorItinerario(req:Request, res:Response) {
  const { itinerarioId } = req.params;

  try {
    const actividades = await prisma.actividad.findMany({
      where: { itinerario_id: Number(itinerarioId) },
    });

    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades del itinerario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// CREAR UNA ACTIVIDAD
// ===============================
export async function crearActividad(req:Request, res:Response) {
  const { nombre, descripcion, hora_inicio, hora_fin, itinerario_id } = req.body;

  try {
    // Validar existencia del itinerario
    const itinerario = await prisma.itinerario.findUnique({
      where: { id: Number(itinerario_id) },
    });

    if (!itinerario) {
      return res.status(400).json({ error: "El itinerario especificado no existe" });
    }

    const nueva = await prisma.actividad.create({
      data: {
        nombre,
        descripcion,
        hora_inicio: hora_inicio ? new Date(hora_inicio) : null,
        hora_fin: hora_fin ? new Date(hora_fin) : null,
        itinerario_id,
      },
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear actividad:", error);
    res.status(500).json({ error: "Error al crear actividad" });
  }
}

// ===============================
// ACTUALIZAR UNA ACTIVIDAD
// ===============================
export async function actualizarActividad(req:Request, res:Response) {
  const { id } = req.params;
  const { nombre, descripcion, hora_inicio, hora_fin, itinerario_id } = req.body;

  try {
    const actualizada = await prisma.actividad.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        hora_inicio: hora_inicio ? new Date(hora_inicio) : null,
        hora_fin: hora_fin ? new Date(hora_fin) : null,
        itinerario_id,
      },
    });

    res.json(actualizada);
  } catch (error) {
    console.error("Error al actualizar actividad:", error);
    res.status(500).json({ error: "Error al actualizar actividad" });
  }
}

// ===============================
// ELIMINAR UNA ACTIVIDAD
// ===============================
export async function eliminarActividad(req:Request, res:Response) {
  const { id } = req.params;

  try {
    await prisma.actividad.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Actividad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    res.status(500).json({ error: "Error al eliminar actividad" });
  }
}
