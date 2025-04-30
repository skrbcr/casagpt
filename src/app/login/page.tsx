import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import Main from '@/components/main'
import LoginForm from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account.',
}

export default async function LoginPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (authData?.user) {
    redirect('/')
  }

  return (
    <Main>
      <div className='flex flex-col items-center justify-center h-screen'>
        <LoginForm />
      </div>
    </Main>
  )
}
