'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
  } from '@/components/ui/select';

type Slot = {
    date : string,
    time : string[]
};

type Dentist = {
    id : string,
    name : string,
    slots : Slot[]
};

export default function BookingPage() {
    const [dentists, setDentists] = useState<Dentist[]>();
    const [selectedDentist, setSelectedDentist] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');

    const mockSlots = [
        {
            date :  '2024-10-18',
            time : ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
        },
        {
            date :  '2024-10-19',
            time : ['9:00 AM', '10:00 AM', '11:00 AM']
        }
    ];

    // Mock Data
    const mockDentists = [
        { id: '1', name: 'Dr. John Doe', slots: mockSlots },
        { id: '2', name: 'Dr. Jane Smith', slots: mockSlots },
        { id: '3', name: 'Dr. Alice Johnson', slots: mockSlots },
    ];
  

    useEffect(() => {
        // Fetch dentists from API
        fetchDentists()
    }, [])

    useEffect(() => {
        if (selectedDentist && selectedDate) {
            fetchAvailableSlots(selectedDentist, selectedDate)
        }
    }, [selectedDentist, selectedDate])

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const fetchDentists = async () => {
        // API call to fetch dentists
        // setDentists(response.data)
        setDentists(mockDentists);
    }

    const fetchAvailableSlots = async (dentistId: string, date: Date) => {
        // API call to fetch available slots
        // setAvailableSlots(response.data)

        console.log(dentistId, date);

        const dentist = dentists?.find((d) => d.id === dentistId);
        if (dentist) {
            const selectedDateString = formatDate(date);
            console.log(selectedDateString);
            // Find the slot matching the selected date
            const slot = dentist?.slots.find((s) => s.date === selectedDateString);
            // setAvailableSlots(dentist.slots.time);
            setAvailableSlots(slot? slot.time : []);
        }
    }

    const handleBookAppointment = async () => {
        // API call to book appointment
        // Show confirmation or error message
    }

    return (
        <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Book an Appointment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Select a Dentist</h2>
                <Select onValueChange={setSelectedDentist}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a dentist" />
                    </SelectTrigger>
                    <SelectContent>
                        {dentists?.map((dentist) => (
                        <SelectItem key={dentist.id} value={dentist.id}>
                            {dentist.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Select a Date</h2>
                <div className='flex-1'>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border w-full h-full flex"
                        disabled={(date) =>date < new Date()}
                    />
                </div>            
            </div>
            
            <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Time Slots</h2>
            {availableSlots?.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                {availableSlots?.map((slot) => (
                    <Button
                    key={slot}
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    onClick={() => setSelectedSlot(slot)}
                    >
                    {slot}
                    </Button>
                ))}
                </div>
            ) : (
                <p className="text-gray-600">No available slots for the selected date.</p>
            )}
            
            {selectedSlot && (
                <Button className="mt-8 w-full" onClick={handleBookAppointment}>
                Book Appointment
                </Button>
            )}
            </div>
        </div>
        </div>
    )
}