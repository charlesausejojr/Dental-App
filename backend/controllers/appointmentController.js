import AppointmentService from "../services/appointmentService.js";

class AppointmentController {
    static async createAppointment (req, res) {
        try {
            const appointment = await AppointmentService.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async getAllAppointments (req, res) {
        try {
            const appointments = await AppointmentService.getAllAppointments();
            console.log("Fetching ALL appointments");
            res.json(appointments);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async getUserAppointments (req, res) {
        try {
            const appointments = await AppointmentService.getUserAppointments(req.user.id);
            console.log("Fetching appointments for user_id:",req.user.id);
            res.json(appointments);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async cancelAppointment (req, res) {
        try {
            await AppointmentService.cancelAppointment(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async updateAppointment (req, res) {
        try {
          const updatedAppointment = await AppointmentService.updateAppointment(req.params.id, req.body);
          if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
          }
          console.log("Updated appointment", updatedAppointment);
          res.json(updatedAppointment);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };
}

export default AppointmentController;