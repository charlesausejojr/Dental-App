import mongoose from "mongoose";

const dentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slots: [{ date: String, time: [String] }]
}, { timestamps: true });

const Dentist = mongoose.model('Dentist', dentistSchema);

export default Dentist;
