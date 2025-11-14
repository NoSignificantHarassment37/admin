import { prisma } from '../../database/prisma.js';
import type { Request, Response } from "express";

// ===============================
// OBTENER TODAS LAS RESERVAS
// ===============================
export const obtenerReservas = async (req: Request, res: Response) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        usuario: true,
        paquete_turistico: true,
      },
    });
    res.json(reservas);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error al obtener las reservas", detalle: error.error });
  }
};

// ===============================
// OBTENER UNA RESERVA POR ID
// ===============================
export const obtenerReservaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
        paquete_turistico: true,
      },
    });
    if (!reserva)
      return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(reserva);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error al obtener la reserva", detalle: error.message });
  }
};

// ===============================
// CREAR UNA NUEVA RESERVA
// ===============================
export const crearReserva = async (req: Request, res: Response) => {
  const {
    usuario_id,
    paquete_id,
    fecha_inicio,
    fecha_fin,
    estado,
    numero_personas,
    precio_total,
    metodo_pago,
    comentarios,
  } = req.body;
  if (fecha_inicio === undefined) {
    return res.status(422).json({ error: "Falta fecha_inicio" });
  }
  if (fecha_fin === undefined) {
    return res.status(422).json({ error: "Falta fecha_fin" });
  }
  if (estado === undefined) {
    return res.status(422).json({ error: "Falta estado" });
  }
  if (numero_personas === undefined) {
    return res.status(422).json({ error: "Falta numero_personas" });
  }
  if (precio_total === undefined) {
    return res.status(422).json({ error: "Falta precio_total" });
  }
  if (metodo_pago === undefined) {
    return res.status(422).json({ error: "Falta metodo_pago" });
  }
  if (comentarios === undefined) {
    return res.status(422).json({ error: "Falta comentarios" });
  }
  if (usuario_id === undefined) {
    return res.status(422).json({ error: "Falta usuario_id" });
  }
  if (paquete_id === undefined) {
    return res.status(422).json({ error: "Falta paquete_id" });
  }
  const data: any = req.body;
  try {
    const nuevaReserva = await prisma.reserva.create({
      data
    });
    return res.status(201).json(nuevaReserva);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al crear la reserva", detalle: error });
  }
};

// ===============================
// ACTUALIZAR UNA RESERVA
// ===============================
/**
 * dto update reserva {
 * 
        usuario_id:number
        paquete_id:number
        fecha_inicio:Date
        fecha_fin:Date
        estado:string
        numero_personas:number
        precio_total:number
        metodo_pago:string
        comentarios:string
}

 */
export const actualizarReserva = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: any = {};
  const {
    usuario_id,
    paquete_id,
    fecha_inicio,
    fecha_fin,
    estado,
    numero_personas,
    precio_total,
    metodo_pago,
    comentarios,
  } = req.body;
  if (fecha_inicio !== undefined) {
    data.fecha_inicio = fecha_inicio;
  }
  if (fecha_fin !== undefined) {
    data.fecha_fin = fecha_fin;
  }
  if (estado !== undefined) {
    data.estado = estado;
  }
  if (numero_personas !== undefined) {
    data.numero_personas = undefined;
  }
  if (precio_total !== undefined) {
    data.precio_total = precio_total;
  }
  if (metodo_pago !== undefined) {
    data.metodo_pago = undefined;
  }
  if (comentarios !== undefined) {
    data.comentarios = comentarios;
  }
  if (usuario_id !== undefined) {
    data.usuario = {
      disconnect: true,
      connect: { id: usuario_id },
    };
  }
  if (paquete_id !== undefined) {
    data.paquete_turistico = {
      disconnect: true,
      connect: { id: paquete_id },
    };
  }
  try {
    const reservaActualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data,
    });
    res.json(reservaActualizada);
  } catch (error: any) {
    res.status(500).json({
      error: "Error al actualizar la reserva",
      detalle: error.message,
    });
  }
};

// ===============================
// ELIMINAR UNA RESERVA
// ===============================
export const eliminarReserva = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.reserva.delete({
      where: { id: Number(id) },
    });
    res.json({ mensaje: "Reserva eliminada correctamente" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error al eliminar la reserva", detalle: error.message });
  }
};
