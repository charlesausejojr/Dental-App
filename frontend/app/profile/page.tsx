'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast, Toaster } from 'sonner'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
    setUserId(user?._id || "");
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        // await updateUser({ name })
        const response = await fetch('/api/auth', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : token || ""
            },
            body: JSON.stringify({ userId , name }),
        });

        if (!response.ok) throw new Error('Failed to update User');
        const { updatedUser } = await response.json();

        console.log(updatedUser);
        setName(updatedUser.name);
        updateUser(updatedUser);
        toast.success('Profile updated successfully')
    } catch (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-8"
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Manage Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster richColors />
    </motion.div>
  )
}