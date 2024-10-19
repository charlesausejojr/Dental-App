import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Dentist, Appointment } from '@/lib/types';

export function useBooking() {
    const [dentists, setDentists] = useState<Dentist[]>();
    const [selectedDentist, setSelectedDentist] = useState<Dentist>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>();
    const [allAppointments, setAllAppointments] = useState<Appointment[]>(); // New state for all appointments

    const { user } = useAuth();
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Function to fetch dentists
    const fetchDentists = async () => {
        const response = await fetch('api/dentists', {
            headers: { 'Authorization': token || '' },
        });
        if (!response.ok) throw new Error('Failed to fetch dentists');
        return await response.json();
    };

    // Function to fetch booked appointments for the user
    const fetchBookedAppointments = async () => {
        const response = await fetch(`/api/appointments?id=${user?._id}`, {
            headers: { 'Authorization': token || '' },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return await response.json();
    };

    // New function to fetch all appointments from the database
    const fetchAllAppointments = async () => {
        const response = await fetch('/api/appointments?type=all', {
            headers: { 'Authorization': token || '' },
        });
        if (!response.ok) throw new Error('Failed to fetch all appointments');
        return await response.json();
    };

    // Function to fetch available slots
    const fetchAvailableSlots = async (dentistId: string, date: Date) => {
        const dentist = dentists?.find(d => d._id === dentistId);
        if (!dentist) return [];

        const dateStr = formatDate(date);
        const slot = dentist.slots?.find(s => s.date === dateStr);

        console.log(dateStr);
        console.log(slot);

        // Get all booked times for the selected dentist and date
        const bookedAppointmentsForDate = allAppointments?.filter(app => 
            // app.dentist is ObjectId reference instead of the Object itself
            String(app.dentist) === dentistId && app.date === dateStr
        ) || [];

        allAppointments?.map((app) => {
                console.log("Compare dentist id:", app.dentist._id === dentistId);
                console.log(app.dentist,dentistId);
                console.log("Compare date: ", app.date === dateStr);
                console.log(app.date, dateStr);
            }
        )

        console.log('Booked Appointments:', bookedAppointments);

        // Extract booked times
        const bookedTimes = bookedAppointmentsForDate.map(app => app.time);

        console.log("All appointments:", allAppointments);
        console.log('Booked Times:', bookedTimes);

        // Return only slots that are not booked
        const availableSlots = slot?.time.filter(t => !bookedTimes.includes(t)) || [];
        console.log('Available Slots:', availableSlots);

        return availableSlots;
    };

    // Function to book an appointment
    const handleBookAppointment = async () => {
        if (selectedDentist && selectedDate && user) {
            const appointmentData = {
                user,
                dentist: selectedDentist,
                date: formatDate(selectedDate),
                time: selectedSlot,
            };
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || '',
                },
                body: JSON.stringify(appointmentData),
            });
            if (!response.ok) throw new Error('Failed to book appointment');
            router.push('/dashboard');
        }
    };

    // useEffect to fetch dentists, user booked appointments, and all appointments
    useEffect(() => {
        const fetchData = async () => {
            const fetchedDentists = await fetchDentists();
            const userBookedAppointments = await fetchBookedAppointments();
            const fetchedAllAppointments = await fetchAllAppointments(); // Fetch all appointments

            setDentists(fetchedDentists);
            setBookedAppointments(userBookedAppointments);
            setAllAppointments(fetchedAllAppointments); // Set all appointments
        };

        fetchData().catch(error => console.error(error)); // Catch any errors in fetching
    }, [token, user]);

    // useEffect to fetch available slots when dentist or date changes
    useEffect(() => {
        if (selectedDentist && selectedDate) {
            fetchAvailableSlots(selectedDentist._id, selectedDate).then(slots => {
                setAvailableSlots(slots);
            });
        }
    }, [selectedDentist, selectedDate, dentists, bookedAppointments]);

    useEffect(() => {
        console.log(bookedAppointments);
    }, [bookedAppointments]);

    if (dentists === null || bookedAppointments === null || allAppointments === null) {
        // Throwing a promise for suspense
        throw new Promise(() => {});
    }

    return {
        user,
        dentists,
        selectedDentist,
        setSelectedDentist,
        selectedDate,
        setSelectedDate,
        availableSlots,
        selectedSlot,
        setSelectedSlot,
        bookedAppointments,
        setBookedAppointments,
        allAppointments, // Return all appointments
        handleBookAppointment,
        formatDate,
    };
}
