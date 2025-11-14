import express from 'express';
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
} from './reservas.controllers.js';

const router = express.Router();

router.get('/', obtenerReservas);
router.get('/:id', obtenerReservaPorId);
router.post('/', crearReserva);
router.patch('/:id', actualizarReserva);
router.delete('/:id', eliminarReserva);

export default router;
