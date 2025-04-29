import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * PATCH /api/threads/:threadId/share
 * Toggle or set the shared flag for a thread.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  // Await dynamic params and extract threadId
  const raw = (await params).threadId;
  if (typeof raw !== 'string') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const threadId = raw;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Parse request body
  const body = await req.json();
  const is_shared = Boolean(body.is_shared);

  // Update share flag with service role (bypass RLS)
  const { data: thread, error } = await supabase
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
