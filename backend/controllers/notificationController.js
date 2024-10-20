import { sendAppointmentReminder } from '../utils/email.js';

export async function notifyPatient(patientEmail, appointmentTime) {
  const message = `Reminder: Your appointment is scheduled for ${appointmentTime}`;

  await sendAppointmentReminder(patientEmail, 'Appointment Reminder', message);
}
