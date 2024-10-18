import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Sample services only
const services = [
  {
    name : 'General Checkup',
    description : 'A general checkup is a comprehensive examination of your oral health to identify and prevent potential dental issues.',
  },
  {
    name : 'Teeth Cleaning',
    description : 'Teeth cleaning is a professional procedure that removes plaque and tartar buildup to maintain oral hygiene and freshen your smile.',
  },
  {
    name : 'Cavity Filling',
    description : 'Cavity filling is a restorative procedure that treats tooth decay by removing decay and filling the affected area to restore the tooth\'s function.',
  }
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-white">
      <main className="container mx-auto px-6 py-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Dental Scheduler</h1>
          <p className="text-xl text-gray-600 mb-8">Your online dental appointment assistant</p>
          <Button asChild>
            <Link href="/booking">Schedule an Appointment</Link>
          </Button>
        </section>
        
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

