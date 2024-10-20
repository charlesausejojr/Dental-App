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
    const [refresh, setRefresh] = useState(false);

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

        // Get all booked times for the selected dentist and date
        const bookedAppointmentsForDate = allAppointments?.filter(app => 
            // app.dentist is ObjectId reference instead of the Object itself
            String(app.dentist) === dentistId && app.date === dateStr
        ) || [];

        // Extract booked times
        const bookedTimes = bookedAppointmentsForDate.map(app => app.time);

        // Get the current time for comparison
        const now = new Date();
        const isToday = formatDate(now) === dateStr; // Check if the selected date is today

        // Return only slots that are not booked
        const availableSlots = slot?.time.filter(t => {
            // Extract hours, minutes, and AM/PM from the time string (e.g., "02:30 PM")
            const [time, period] = t.split(' ');
            const [hoursRaw, minutes] = time.split(':').map(part => parseInt(part, 10) || 0);
            let hours = hoursRaw;

            // Convert 12-hour format to 24-hour format
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
           // Create a valid slot time for the specific date
            const slotTime = new Date(date.getTime()); // Clone the input date
            slotTime.setHours(hours, minutes, 0, 0); // Set hours and minutes
            console.log(slotTime, now);

            const isFutureSlot = !isToday || slotTime > now;
            return isFutureSlot && !bookedTimes.includes(t);
        }) || [];

        // Sort the available slots from earliest to latest
        availableSlots.sort((a, b) => {
            const [timeA, periodA] = a.split(' ');
            const [timeB, periodB] = b.split(' ');
            const [hoursA, minutesA] = timeA.split(':').map(part => parseInt(part, 10) || 0);
            const [hoursB, minutesB] = timeB.split(':').map(part => parseInt(part, 10) || 0);

            // Convert to 24-hour format for comparison
            const hoursA24 = (periodA === 'PM' && hoursA !== 12) ? hoursA + 12 : (periodA === 'AM' && hoursA === 12) ? 0 : hoursA;
            const hoursB24 = (periodB === 'PM' && hoursB !== 12) ? hoursB + 12 : (periodB === 'AM' && hoursB === 12) ? 0 : hoursB;

            return hoursA24 * 60 + minutesA - (hoursB24 * 60 + minutesB); // Compare total minutes
        });

        console.log(availableSlots);

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
        setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user, refresh]);

    // useEffect to fetch available slots when dentist or date changes
    useEffect(() => {
        if (selectedDentist && selectedDate) {
            fetchAvailableSlots(selectedDentist._id, selectedDate).then(slots => {
                setAvailableSlots(slots);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setAllAppointments,
        handleBookAppointment,
        formatDate,
        fetchAvailableSlots,
        setAvailableSlots,
        setRefresh,
    };
}
