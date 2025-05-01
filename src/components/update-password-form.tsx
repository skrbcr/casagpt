"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { logout } from '@/lib/auth-actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function UpdatePasswordForm() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setStatus('error')
      return
    }

    const { error: supabaseError } = await supabase.auth.updateUser({ password })

    if (supabaseError) {
      setError(supabaseError.message)
      setStatus('error')
    } else {
      setStatus('success')
      // Use server action logout to sign out and redirect to login
      await logout()
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>Enter and confirm your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          {status === 'error' && <p className="text-sm text-red-500">{error}</p>}
          {status === 'success' && (
            <p className="text-sm text-green-500">
              Password updated successfully. Redirecting...
            </p>
          )}
          <Button type="submit" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
      <CardFooter />
    </Card>
  )
}
