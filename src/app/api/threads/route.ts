import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: threads, error } = await supabase
    .from("threads")
    .select("id, title, is_shared, created_at, updated_at")
    .eq("user_id", authData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch threads:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }

  return NextResponse.json(threads ?? []);
}

/**
 * POST /api/threads
 * Create a new thread with an optional title.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const title = typeof body.title === 'string' && body.title.trim() !== ''
    ? body.title.trim()
    : 'Untitled';

  const { data: thread, error } = await supabase
    .from('threads')
    .insert({ user_id: authData.user.id, title })
    .select('id, title, is_shared, created_at, updated_at')
    .single();

  if (error) {
    console.error('Failed to create thread:', error.message);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }

  return NextResponse.json(thread, { status: 201 });
}
