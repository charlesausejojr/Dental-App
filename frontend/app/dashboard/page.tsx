'use client';

import { motion, AnimatePresence } from 'framer-motion'
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DateSelector from '../ui/booking/dateSelector';
import AvailableSlots from '../ui/booking/availableSlots';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import LoadingSpinner from '../ui/loading-spinner';

export default function UserDashboard() {
  const {
    bookedAppointments,
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    setSelectedDentist,
    formatDate,
  } = useBooking();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const handleReschedule = async () => {
    const updatedAppointment = {
      ...selectedAppointment,
      date: formatDate(selectedDate || new Date()),
      time: selectedSlot,
    };

    try {
      await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify({ id: selectedAppointment?._id, appointmentData: updatedAppointment }),
      });
      console.log("Updating appointment", updatedAppointment);
      return Promise.resolve();
    } catch (error) {
      console.error('Error during reschedule:', error);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' },
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const handleRescheduleClick = async (event: React.FormEvent) => {
    event.preventDefault();
    const promise = handleReschedule();
    toast.promise(promise, {
      loading: 'Rescheduling...',
      success: async () => {
        window.location.reload();
        return 'You have now rescheduled this appointment';
      },
      error: 'Failed to reschedule',
    });
  };

  const handleCancelClick = async (event: React.FormEvent, appointmentId: string) => {
    event.preventDefault();
    const promise = handleCancel(appointmentId);
    toast.promise(promise, {
      loading: 'Canceling appointment...',
      success: async () => {
        window.location.reload();
        return 'You have now canceled this appointment';
      },
      error: 'Failed to cancel',
    });
  };

  // Helper function to check if an appointment is in the past
  const isPastAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDateTime < new Date();
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <motion.div className="container mx-auto px-6 py-8">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold text-gray-800 mb-6">
            Your Dashboard
          </motion.h1>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-700">
              Upcoming Appointments for {user?.name}
            </h2>
          </div>
          <AnimatePresence> 
            {bookedAppointments && bookedAppointments.length > 0 ? (
              <ul>
                {bookedAppointments
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
                  .map((appointment: Appointment) => (
                    <li
                      key={appointment._id}
                      className="px-6 py-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">{appointment.dentist.name}</p>
                        <p className="text-gray-600">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <div>
                        {isPastAppointment(appointment) ? (
                          <span className="text-green-600 font-semibold">Completed</span>
                        ) : (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() => {
                                    setSelectedDentist(appointment.dentist);
                                    setSelectedAppointment(appointment);
                                  }}
                                >
                                  Reschedule
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reschedule Appointment</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleRescheduleClick}>
                                  <div className="mb-4">
                                    <label className="block text-gray-700">New Date</label>
                                    <DateSelector
                                      selectedDate={selectedDate}
                                      onDateChange={setSelectedDate}
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <label className="block text-gray-700">New Time</label>
                                    <AvailableSlots
                                      availableSlots={availableSlots}
                                      selectedSlot={selectedSlot}
                                      onSelectSlot={setSelectedSlot}
                                      onBook={handleReschedule}
                                    />
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              onClick={(e) => handleCancelClick(e, appointment._id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="px-6 py-4 text-gray-600">You have no upcoming appointments.</p>
            )}
          </AnimatePresence>
        </motion.div>
        <Toaster richColors />
      </motion.div>
    </Suspense>
  );
}
