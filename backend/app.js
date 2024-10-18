import express from "express";
import cors from "cors";

// charlesausejojr
// KfQLHfKeNKLKHT6f

import userRoute from "./routes/userRoute.js";
import dentistRoute from "./routes/dentistRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/users', userRoute);
app.use('/api/dentists', dentistRoute);
app.use('/api/appointments', appointmentRoute);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message : err.message });
});

export default app;



