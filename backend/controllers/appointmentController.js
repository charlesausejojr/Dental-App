import AppointmentService from "../services/appointmentService.js";

class AppointmentController {
    static async createAppointment (req, res) {
        try {
            const appointment = await AppointmentService.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async getUserAppointments (req, res) {
        try {
            const appointments = await AppointmentService.getUserAppointments(req.user.id);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async cancelAppointment (req, res) {
        try {
            await AppointmentService.cancelAppointment(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async updateAppointment (req, res) {
        try {
          const updatedAppointment = await AppointmentService.updateAppointment(req.params.id, req.body);
          if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
          }
          res.json(updatedAppointment);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    };
}

export default AppointmentController;