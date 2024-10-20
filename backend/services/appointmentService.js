import Appointment from "../models/appointmentModel.js";

class AppointmentService {
    static async createAppointment (data) {
        const appointment = new Appointment(data);
        return await appointment.save();
    };

    static async getAllAppointments(){
        return await Appointment.find();
    }

    static async getUserAppointments (userId) {
        return await Appointment.find({ user: userId }).populate('dentist');
    };

    static async cancelAppointment (id) {
        return await Appointment.findByIdAndDelete(id);
    };

    static async updateAppointment (id, data) {
        return await Appointment.findByIdAndUpdate(id, data, { new: true });
    };
}

export default AppointmentService;

