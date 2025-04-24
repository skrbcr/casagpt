import { login } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import Main from '@/components/main'
import AuthForm from '@/components/auth-form'

export default async function LoginPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (authData?.user) {
    redirect('/')
  }

  return (
    <Main>
      <div className='flex flex-col items-center justify-center h-screen'>
        <AuthForm title='Login' formAction={login}/>
      </div>
    </Main>
  )
}
