import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Main from "@/components/main";

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    redirect('/login')
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', authData.user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile data:', profileError)
    return <p className='pt-23'>Error fetching profile data</p>
  }

  return (
    <Main>
      <p>Hello {profileData.email}</p>
    </Main>
  );
}
