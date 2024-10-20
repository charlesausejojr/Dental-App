'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dentist } from '@/lib/types';
import { useBooking } from '@/hooks/useBooking';

export default function DentistAvailabilityManager() {
  const [newDentistName, setNewDentistName] = useState('')
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState('09:00')
  const [authorized, setAuthorized] = useState(false)
  const [dentistList, setDentistList] = useState<Dentist[] | undefined>([]); 


  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const { dentists, formatDate } = useBooking();

  const formatTime = (time: string) => {
    if (time === "12:00 AM") return time;
    else {
      const [hour, minute] = time.split(':').map(Number);
      // Ensure minute is a valid number; default to 0 if NaN
      const validMinute = isNaN(minute) ? 0 : minute;
      const ampm = hour >= 12 ? (hour === 12 ? 'PM' : 'PM') : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
      return `${formattedHour}:${validMinute.toString().padStart(2, '0')} ${ampm}`;
    }
  };

  const handleCreateDentist = async () => {
    if (newDentistName) {
      const newDentist = {
        name: newDentistName,
        slots: [],
      }
      try {
        const response = await fetch ('/api/dentists', {
          method: 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Authorization': token || '',
          },
          body : JSON.stringify(newDentist)
        });
        if (!response.ok) throw new Error('Failed to create dentist');
        const { createdDentist } = await response.json();
        setDentistList([...dentistList || [], createdDentist]); // Update local dentist list state
        setNewDentistName(''); // Clear input
        console.log(createdDentist);
      } catch (error) {
        console.error('Error during creation of Dentist:', error);
      }
    }
  }

  const handleAddTime = () => {
    if (currentTime && !selectedTimes.includes(currentTime)) {
      setSelectedTimes([...selectedTimes, currentTime].sort());
    }
  };

  const handleRemoveTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter(t => t !== time))
  }

  const handleAddAvailability = async () => {
    if (selectedDentist && selectedDate && selectedTimes.length > 0) {
        const formattedDate = formatDate(selectedDate);

        // Ensure slots is defined, defaulting to an empty array if undefined
        const existingSlots = selectedDentist.slots || [];

        // Check if the slot for the selected date already exists
        const existingSlotIndex = selectedDentist.slots?.findIndex(slot => slot.date === formattedDate);

        let updatedSlots;

        if (existingSlotIndex !== -1 && existingSlotIndex) {
          // Update the existing slot with new times, avoiding duplicates
          const existingSlot = existingSlots[existingSlotIndex];
          const updatedTimes = Array.from(
              new Set([...existingSlot.time, ...selectedTimes.map(formatTime)])
          );

          updatedSlots = [
              ...existingSlots.slice(0, existingSlotIndex),
              { ...existingSlot, time: updatedTimes },
              ...existingSlots.slice(existingSlotIndex + 1),
          ];
      } else {
          // Add a new slot for the selected date
          updatedSlots = [
              ...existingSlots,
              { date: formattedDate, time: selectedTimes.map(formatTime) },
          ];
      }

      const updatedDentist = { ...selectedDentist, slots: updatedSlots };
      try {
          await fetch(`/api/dentists`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token || '',
              },
              body: JSON.stringify({ id: selectedDentist?._id, updatedDentist }),
          });
          console.log("Updating dentist", updatedDentist);
          // Update the selected dentist in local state without reloading
          setSelectedDentist(updatedDentist);
          setSelectedTimes([]); // Clear selected times after adding availability
      } catch (error) {
          console.error('Error during reschedule:', error);
      }
    }
  };


  useEffect(() => {
    const handleAuthorization = () => {
      const name = process.env.NEXT_PUBLIC_AUTH_NAME; // Get the token from environment variables
      if (user) {
        const userJSON = JSON.parse(user);
        if (userJSON?.name === name) {
          setAuthorized(true);
        } else {
          alert('Unauthorized access. Please check your token.');
        }
      }
    };
    setDentistList(dentists);
    handleAuthorization();
  },[dentists, user]);

  if (!authorized) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">You have no access to this page</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dentist Availability Manager</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Dentist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Dentist Name"
              value={newDentistName}
              onChange={(e) => setNewDentistName(e.target.value)}
            />
            <Button onClick={handleCreateDentist}>Create</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dentist-select">Select Dentist</Label>
              <Select onValueChange={(value) => setSelectedDentist(dentists?.find(d => d._id === value) || null)}>
                <SelectTrigger id="dentist-select">
                  <SelectValue placeholder="Choose a dentist" />
                </SelectTrigger>
                <SelectContent>
                  {dentistList?.map((dentist) => (
                    <SelectItem key={dentist._id} value={dentist._id}>
                      {dentist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDentist && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Date</Label>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md border"
                    />
                  </div>

                  <div>
                    <Label>Select Time Slots</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="time"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        min="09:00"
                        max="17:00"
                        step="1800"
                      />
                      <Button onClick={handleAddTime}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTime(time)}>
                        {formatTime(time)} ✕ 
                      </Button>))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleAddAvailability}>Add Availability</Button>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
                  {selectedDentist?.slots?.map((slot, index) => (
                    slot.date >= formatDate(new Date()) && 
                    <div key={index} className="mb-2">
                        <strong>{slot.date}:</strong> {slot.time.join(', ')} 
                    </div>))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
