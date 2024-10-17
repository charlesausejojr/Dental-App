import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'Dentist', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
