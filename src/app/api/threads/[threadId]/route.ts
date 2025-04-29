import { NextRequest, NextResponse } from "next/server";
import { createClient as createAnonClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * DELETE /api/threads/:threadId
 * Delete a thread (and its messages via cascade).
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: { threadId: string } },
) {
  // Await params for dynamic route
  const { threadId } = await context.params;

  // Authenticate user
  const anon = await createAnonClient();
  const { data: authData } = await anon.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: threadRow, error: ownerError } = await anon
    .from("threads")
    .select("user_id")
    .eq("id", threadId)
    .single();
  if (ownerError || threadRow?.user_id !== authData.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use service role to delete thread (bypass RLS)
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svcKey) {
    console.error("Environment variable SUPABASE_SERVICE_ROLE_KEY is not configured");
    return NextResponse.json(
      { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required" },
      { status: 500 }
    );
  }
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    svcKey
  );
  const { error: deleteError } = await admin
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
  context: { params: { threadId: string } },
) {
  const { threadId } = context.params;
  // Authenticate user
  const anon = await createAnonClient();
  const { data: authData } = await anon.auth.getUser();
  if (!authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Verify ownership
  const { data: threadRow, error: ownerError } = await anon
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
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svcKey) {
    console.error('Environment variable SUPABASE_SERVICE_ROLE_KEY is not configured');
    return NextResponse.json(
      { error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required' },
      { status: 500 }
    );
  }
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    svcKey
  );
  const { error: updateError } = await admin
    .from('threads')
    .update({ title })
    .eq('id', threadId);
  if (updateError) {
    console.error('Failed to update thread title:', updateError.message);
    return NextResponse.json({ error: 'Failed to update thread title' }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
