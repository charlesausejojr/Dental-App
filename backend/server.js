import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import cron from 'node-cron';
import { sendAppointmentReminder } from "./utils/email.js";
import Appointment from "./models/appointmentModel.js";
import User from "./models/userModel.js";
import moment from "moment-timezone";

// Load environment variables
dotenv.config();

// Function to format date and time into a proper DateTime object
function getAppointmentDateTime(date, time) {
  return moment.tz(`${date} ${time}`, 'YYYY-MM-DD hh:mm A', 'Asia/Manila');
}

// Cron job: Runs every minute to check for appointments happening in 1 hour
cron.schedule('* * * * *', async () => {
  try {
    const now = moment().tz('Asia/Manila'); // Current time in Manila timezone
    const oneHourLater = now.add(1, 'hour');

    console.log(`Checking for appointments at: ${oneHourLater.format()}`);

    // Query appointments scheduled 1 hour from now
    const appointments = await Appointment.find();

    for (const appointment of appointments) {
      const appointmentTime = getAppointmentDateTime(appointment.date, appointment.time);

      // Check if the appointment is exactly 1 hour from now
      if (appointmentTime.isSame(oneHourLater, 'minute')) {
        // Get user details to send the email
        const user = await User.findById(appointment.user);
        if (!user) continue;

        const emailText = `
          Hi ${user.name}, 
          This is a reminder for your appointment with your dentist on 
          ${appointment.date} at ${appointment.time}.
        `;

        await sendEmail(user.email, 'Appointment Reminder', emailText);
        console.log(`Reminder sent to: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Error running scheduler:', error);
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});