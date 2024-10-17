'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/lib/types';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to your backend
    console.log('Logging in with:', { email, password })
    try {
        const response = await fetch('/api/auth?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(errorData.error);
            throw new Error(`Error logging in User: ${response.statusText}`);
        }

        const { token } = await response.json();
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Error logging in User :', error);
    }

    // On successful login, redirect to dashboard
    // router.push('/dashboard')
  }

  return (
    <div className="container mx-auto flex items-center justify-center pt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              Login
            </Button>
            <div className="text-center">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}