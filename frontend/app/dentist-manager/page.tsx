'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Slot = {
  date: string
  time: string[]
}

type Dentist = {
  id: string
  name: string
  slots: Slot[]
}

export default function DentistAvailabilityManager() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [newDentistName, setNewDentistName] = useState('')
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState('09:00')
  const [authorized, setAuthorized] = useState(false)
  const [tokenInput, setTokenInput] = useState('')

  useEffect(() => {
    fetchDentists()
  }, [])

  const fetchDentists = async () => {
    // Mock data for dentists
    const mockDentists: Dentist[] = [
      { id: '1', name: 'Dr. John Doe', slots: [] },
      { id: '2', name: 'Dr. Jane Smith', slots: [] },
    ]
    setDentists(mockDentists)
  }

  const handleCreateDentist = () => {
    if (newDentistName) {
      const newDentist: Dentist = {
        id: Date.now().toString(),
        name: newDentistName,
        slots: [],
      }
      setDentists([...dentists, newDentist])
      setNewDentistName('')
    }
  }

  const handleAddTime = () => {
    if (currentTime && !selectedTimes.includes(currentTime)) {
      setSelectedTimes([...selectedTimes, currentTime].sort())
    }
  }

  const handleRemoveTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter(t => t !== time))
  }

  const handleAddAvailability = () => {
    if (selectedDentist && selectedDate && selectedTimes.length > 0) {
      const formattedDate = selectedDate.toISOString().split('T')[0]
      const updatedDentist = {
        ...selectedDentist,
        slots: [
          ...selectedDentist.slots,
          { date: formattedDate, time: selectedTimes },
        ],
      }
      setDentists(dentists.map(d => d.id === selectedDentist.id ? updatedDentist : d))
      setSelectedDentist(updatedDentist)
      setSelectedTimes([])
    }
  }

  const handleAuthorization = () => {
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN; // Get the token from environment variables
    if (tokenInput === token) {
      setAuthorized(true);
    } else {
      alert('Unauthorized access. Please check your token.');
    }
  };

  if (!authorized) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Enter Access Token</h1>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Access Token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <Button onClick={handleAuthorization}>Submit</Button>
        </div>
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
              <Select onValueChange={(value) => setSelectedDentist(dentists.find(d => d.id === value) || null)}>
                <SelectTrigger id="dentist-select">
                  <SelectValue placeholder="Choose a dentist" />
                </SelectTrigger>
                <SelectContent>
                  {dentists.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id}>
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
                          onClick={() => handleRemoveTime(time)}
                        >
                          {time} ✕
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleAddAvailability}>Add Availability</Button>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
                  {selectedDentist.slots.map((slot, index) => (
                    <div key={index} className="mb-2">
                      <strong>{slot.date}:</strong> {slot.time.join(', ')}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
