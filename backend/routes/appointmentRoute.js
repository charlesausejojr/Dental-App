import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';

import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, AppointmentController.createAppointment);
router.get('/', authenticate, AppointmentController.getAllAppointments);
router.get('/:id', authenticate, AppointmentController.getUserAppointments);
router.delete('/:id', authenticate, AppointmentController.cancelAppointment);
router.put('/:id', authenticate, AppointmentController.updateAppointment);

export default router;
