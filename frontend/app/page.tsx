'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ClipboardPlus, Calendar, PaintBucket, Sparkles } from 'lucide-react'

const services = [
  {
    name: 'General Checkup',
    description: 'Comprehensive examination of your oral health',
    icon: ClipboardPlus,
  },
  {
    name: 'Teeth Cleaning',
    description: 'Professional plaque and tartar removal',
    icon: Sparkles,
  },
  {
    name: 'Cavity Filling',
    description: 'Restorative treatment for tooth decay',
    icon: PaintBucket,
  },
]

export default function Home() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('authToken'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Dental Scheduler</h1>
          <p className="text-xl text-gray-600 mb-8">Your online dental appointment assistant</p>
          <Button asChild size="lg" className="rounded-full">
            <Link href={token ? "/booking" : "/login"}>
              <Calendar className="mr-2 h-4 w-4" /> Schedule an Appointment
            </Link>
          </Button>
        </motion.section>

        <motion.section 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <service.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}