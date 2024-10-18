'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/lib/types';

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to your backend
    console.log('Registering with:', { name, email, password })
    const newUser : User = { name, email, password};
    try {
        const response = await fetch('/api/auth?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });
  
        if (!response.ok) {
            const errorData = await response.json();
            console.error(errorData.error);
            throw new Error(`Error adding User: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error registering User :', error);
    }

    // On successful registration, redirect to dashboard
    router.push('/login')
  }

  return (
    <div className="container mx-auto flex items-center justify-center pt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-blue-500">
              Register
            </Button>
            <div className="text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}