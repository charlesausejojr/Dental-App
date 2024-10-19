'use client';

import { motion } from 'framer-motion'
import { useBooking } from '@/hooks/useBooking';
import DentistSelector from '../ui/booking/dentistSelector';
import DateSelector from '../ui/booking/dateSelector';
import AvailableSlots from '../ui/booking/availableSlots';

export default function BookingPage() {
    const {
        dentists,
        setSelectedDentist,
        selectedDate,
        setSelectedDate,
        availableSlots,
        selectedSlot,
        setSelectedSlot,
        handleBookAppointment,
    } = useBooking();

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8"
    >
        <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold text-gray-800 mb-6"
        >
            Book an Appointment
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Select a Dentist</h2>
                <DentistSelector dentists={dentists} onSelect={setSelectedDentist} />
                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Select a Date</h2>
                <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </motion.div>
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <AvailableSlots
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    onBook={handleBookAppointment}
                />
            </motion.div>
        </div>
    </motion.div>
    );
}
