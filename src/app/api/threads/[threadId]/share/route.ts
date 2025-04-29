import { NextRequest, NextResponse } from "next/server";
import { createClient as createAnonClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * PATCH /api/threads/:threadId/share
 * Toggle or set the shared flag for a thread.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: { threadId: string } },
) {
  const { params } = context;
  const { threadId } = params;
  // Authenticate user via anon client
  const anon = await createAnonClient();
  const { data: authData } = await anon.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const is_shared = Boolean(body.is_shared);

  // Request body
  const body = await req.json();
  const is_shared = Boolean(body.is_shared);
  // Update share flag with service role (bypass RLS)
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svcKey) {
    console.error('Service role key not configured');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    svcKey
  );
  const { data: thread, error } = await admin
    .from('threads')
    .update({ is_shared })
    .eq('id', threadId)
    .select('id, is_shared')
    .single();

  if (error) {
    console.error("Failed to update share flag:", error.message);
    return NextResponse.json(
      { error: "Failed to update share flag" },
      { status: 500 },
    );
  }

  // Construct share URL for client
  const share_url = `/?share=${threadId}`;
  return NextResponse.json({
    id: thread.id,
    is_shared: thread.is_shared,
    share_url,
  });
}
