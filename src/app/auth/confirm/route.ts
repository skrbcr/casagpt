import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      redirect(next) // ✅ サーバーリダイレクト（即 return される）
    }

    return NextResponse.json({ error: error.message }, { status: 400 }) // ✅ 正常な返り値
  }

  return NextResponse.json({ error: 'Invalid token or type' }, { status: 400 }) // ✅ 正常な返り値
}
