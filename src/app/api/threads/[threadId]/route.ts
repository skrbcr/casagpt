import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * DELETE /api/threads/:threadId
 * Delete a thread (and its messages via cascade).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },                                                                                                                                               
) {
  // Await dynamic params and extract threadId
  const raw = (await params).threadId;
  if (typeof raw !== 'string') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const threadId = raw;

  // Authenticate user
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: threadRow, error: ownerError } = await supabase
    .from("threads")
    .select("user_id")
    .eq("id", threadId)
    .single();
  if (ownerError || threadRow?.user_id !== authData.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use service role to delete thread (bypass RLS)
  const { error: deleteError } = await supabase
    .from("threads")
    .delete()
    .eq("id", threadId);
  if (deleteError) {
    console.error("Failed to delete thread:", deleteError.message);
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

/**
 * PATCH /api/threads/:threadId
 * Update a thread's title.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }>,  },
) {
  // Await dynamic params and extract threadId
  const raw = (await params).threadId;
  if (typeof raw !== 'string') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const threadId = raw;
  // Authenticate user
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Verify ownership
  const { data: threadRow, error: ownerError } = await supabase
    .from('threads')
    .select('user_id')
    .eq('id', threadId)
    .single();
  if (ownerError || threadRow?.user_id !== authData.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Parse new title
  const body = await req.json();
  const title = typeof body.title === 'string' && body.title.trim() !== ''
    ? body.title.trim()
    : 'Untitled';
  // Update title using service role
  const { error: updateError } = await supabase
    .from('threads')
    .update({ title })
    .eq('id', threadId);
  if (updateError) {
    console.error('Failed to update thread title:', updateError.message);
    return NextResponse.json({ error: 'Failed to update thread title' }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
