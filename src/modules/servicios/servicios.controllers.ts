import type { Request, Response } from "express";
import { prisma } from '../../database/prisma.js';
// ===============================
// OBTENER TODOS LOS SERVICIOS
// ===============================
export async function obtenerServicios(req: Request, res: Response) {
  try {
    const servicios = await prisma.servicio.findMany({
      select: {
        id:true,
        nombre:true,
        tipo:true,
        descripcion:true,
        precio:true,
        paquetes:{
          select:{
            paquete:{
              select:{
                id:true,
                nombre:true
              }
            }
          }
        }
      }
    });
    res.status(200).json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// OBTENER UN SERVICIO POR ID
// ===============================
export async function obtenerServicioPorId(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
      include: {
        paquetes: {
          include: {
            paquete: true,
          },
        },
      },
    });

    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json(servicio);
  } catch (error) {
    console.error("Error al obtener servicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ===============================
// CREAR UN SERVICIO
// ===============================
/*
// DTO para CREAR servicio
POST /api/servicios
Content-Type: application/json

{
  "nombre": "Transporte al aeropuerto",
  "descripcion": "Incluye ida y vuelta al aeropuerto",
  "precio": 150.50,
  "tipo": "transporte",
  "paquetes_ids"?: [1, 3]
}

*/
export async function crearServicio(req: Request, res: Response) {
  const { nombre, descripcion, precio, tipo, paquetes_ids } = req.body;
  try {
    const data: any = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      tipo
    };
    // La logica de abajo se encarga de manejar la relacion N:M, ya que un registro puede o no estar conectado a muchos.
    let paquetesConnect: number[] = Array.isArray(paquetes_ids) ? paquetes_ids.map(Number).filter((id) => !isNaN(id)) : [];
    if (paquetesConnect.length > 0) {
      data.connect = paquetesConnect.map(id => { id });
    }
    const nuevo = await prisma.servicio.create({
      data,
      include: {
        paquetes: {
          include: { paquete: true },
        },
      },
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({ error: "Error al crear servicio" });
  }
}

// ===============================
// ACTUALIZAR UN SERVICIO
// ===============================
/*
PUT /api/servicios/2
Content-Type: application/json

{
  "nombre": "Alojamiento en hotel 4 estrellas",
  "descripcion": "Habitación doble con desayuno",
  "precio": 420.00,
  "tipo": "alojamiento",
  "paquetes_ids": [2, 4]
}

 */
export async function actualizarServicio(req: Request, res: Response) {
  const { id } = req.params;
  const { nombre, descripcion, precio, tipo, paquetes_ids } = req.body;

  try {
    // Borrar relaciones previas N:M
    await prisma.paquete_servicio.deleteMany({
      where: { servicio_id: Number(id) },
    });

    // Construcción de "data" igual que en crearServicio
    const data: any = {};

    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (precio !== undefined) data.precio = parseFloat(precio);
    if (tipo !== undefined) data.tipo = tipo;

    // Normalizar IDs igual que arriba
    let paquetesConnect: number[] = Array.isArray(paquetes_ids)
      ? paquetes_ids.map(Number).filter((id) => !isNaN(id))
      : [];

    if (paquetesConnect.length > 0) {
      data.paquetes = {
        create: paquetesConnect.map((paqueteId) => ({
          paquete: { connect: { id: paqueteId } },
        })),
      };
    }

    const actualizado = await prisma.servicio.update({
      where: { id: Number(id) },
      data,
      include: {
        paquetes: {
          include: { paquete: true },
        },
      },
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
}


// ===============================
// ELIMINAR UN SERVICIO
// ===============================
export async function eliminarServicio(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.servicio.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
}
