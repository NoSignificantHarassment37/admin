import { prisma } from '../../database/prisma.js'
import type { Request, Response } from 'express';
// ===============================
// OBTENER TODOS LOS ITINERARIOS
// ===============================
export async function obtenerItinerarios(req: Request, res: Response) {
  try {
    const itinerarios = await prisma.itinerario.findMany({
      include: {
        paquete: true,
        actividades: true,
      },
    });
    res.json(itinerarios);
  } catch (error) {
    console.error("Error al obtener itinerarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// OBTENER UN ITINERARIO POR ID
// ===============================
export async function obtenerItinerarioPorId(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const itinerario = await prisma.itinerario.findUnique({
      where: { id: Number(id) },
      include: { paquete: true, actividades: true },
    });

    if (!itinerario) {
      return res.status(404).json({ error: "Itinerario no encontrado" });
    }

    res.json(itinerario);
  } catch (error) {
    console.error("Error al obtener itinerario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// CREAR UN ITINERARIO
// ===============================
/*
POST /api/itinerarios
Content-Type: application/json

{
  "dia": 1,
  "descripcion": "Llegada y registro en el hotel",
  "paquete_id": number,
  "actividades_ids":number[],
}
 */
export async function crearItinerario(req: Request, res: Response) {
  const { dia, descripcion, paquete_id, actividades_id: actividades_ids } = req.body;
  const data: any = {
    dia,
    descripcion
  }
  const actividadesConnect: number[] = Array.isArray(actividades_ids)
    ? actividades_ids.map(Number).filter((id) => !isNaN(id))
    : [];
  data.actividades = {
    connect: actividadesConnect.map(id => { id })
  }
  if (paquete_id) {
    data.paquete = {
      connect: { id: paquete_id }
    }
  }
  try {
    const nuevo = await prisma.itinerario.create({
      data
    },
    );

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear itinerario:", error);
    res.status(500).json({ error: "Error al crear itinerario" });
  }
}

// ===============================
// ACTUALIZAR UN ITINERARIO
// ===============================
/*
PUT /api/itinerarios/1
Content-Type: application/json

{
  "dia": 2,
  "descripcion": "Visita guiada al parque nacional",
  "paquete_id": 2,
  "actividades_ids":number[]
}
*/
export async function actualizarItinerario(req: Request, res: Response) {
  const { id } = req.params;
  const { dia, descripcion, paquete_id, actividades_ids } = req.body;
  const data:any = {
    dia,
    descripcion
  };
  if(paquete_id){
    data.paquete = {
      connect:{ id:paquete_id }
    }
  }
  const actividadesConnect:number[] = Array.isArray(actividades_ids) ? actividades_ids.map(Number).filter(id => Number.isNaN(id)) : [];
  if(actividadesConnect.length > 0){
    data.actividades = {
      set:actividadesConnect.map(id => {id})
    }
  }
  try {
    const actualizado = await prisma.itinerario.update({
      where: { id: Number(id) },
      data: { dia, descripcion, paquete_id },
    });

    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar itinerario:", error);
    res.status(500).json({ error: "Error al actualizar itinerario" });
  }
}

// ===============================
// ELIMINAR UN ITINERARIO
// ===============================
export async function eliminarItinerario(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.itinerario.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Itinerario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar itinerario:", error);
    res.status(500).json({ error: "Error al eliminar itinerario" });
  }
}
