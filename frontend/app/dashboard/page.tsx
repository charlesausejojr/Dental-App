'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Appointment {
  id: string
  dentist: string
  date: string
  time: string
}

export default function UserDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      dentist: 'Dr. John Doe',
      date: '2024-10-20',
      time: '09:00 AM',
    },
    {
      id: '2',
      dentist: 'Dr. Jane Smith',
      date: '2024-10-22',
      time: '11:30 AM',
    },
    {
      id: '3',
      dentist: 'Dr. Alice Johnson',
      date: '2024-10-25',
      time: '02:00 PM',
    },
  ]
  
  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    // API call to fetch user's appointments
    // setAppointments(response.data)
    setAppointments(mockAppointments);
  }

  /*
  const handleReschedule = async (newDate: string, newTime: string) => {
    // API call to reschedule appointment
    // Update appointments state
    // Close dialog
  }
  */

  const handleReschedule = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    if (selectedAppointment) {
      const updatedAppointment = {
        ...selectedAppointment,
        date: newDate,
        time: newTime,
      };
  
      // Update the appointments state with the new appointment details
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );

      // Add API update call
  
      // Close the dialog and reset the selected appointment
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
    }
  };
  

  const handleCancel = async (appointmentId: string) => {
    // API call to cancel appointment
    // Update appointments state
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">Upcoming Appointments</h2>
        </div>
        
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id} className="px-6 py-4 border-b last:border-b-0 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">{appointment.dentist}</p>
                  <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mr-2" onClick={() => setSelectedAppointment(appointment)}>
                        Reschedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                      </DialogHeader>
                      {/* Add rescheduling form here */}
                      <form onSubmit={handleReschedule}>
                        <div className="mb-4">
                          <label className="block text-gray-700">New Date</label>
                          <input
                            type="date"
                            defaultValue={appointment.date}
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">New Time</label>
                          <input
                            defaultValue={appointment.time}
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="border rounded w-full px-3 py-2"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" variant="default" className="mr-2">
                            Confirm
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleCancel(appointment.id)}>
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-4 text-gray-600">You have no upcoming appointments.</p>
        )}
      </div>
    </div>
  )
}