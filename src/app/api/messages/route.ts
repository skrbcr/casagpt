import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/messages?thread_id=<uuid>
 * Retrieve messages for a given thread in ascending order.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const thread_id = url.searchParams.get("thread_id");
  if (!thread_id) {
    return NextResponse.json(
      { error: "thread_id is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, thread_id, role, content, responses_id, created_at")
    .eq("thread_id", thread_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }

  return NextResponse.json(messages ?? []);
}

/**
 * POST /api/messages
 * Create a new message and update the parent thread's updated_at.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { thread_id, role, content, responses_id } = body;
  if (!thread_id || !role || !content) {
    return NextResponse.json(
      { error: "thread_id, role, and content are required" },
      { status: 400 },
    );
  }
  if (role !== "user" && role !== "ai") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Insert the message
  const { data: message, error: insertError } = await supabase
    .from("messages")
    .insert({
      thread_id,
      user_id: authData.user.id,
      role,
      content,
      responses_id: responses_id ?? null,
    })
    .select("id, thread_id, role, content, responses_id, created_at")
    .single();

  if (insertError) {
    console.error("Failed to insert message:", insertError.message);
    return NextResponse.json(
      { error: "Failed to insert message" },
      { status: 500 },
    );
  }

  // Update thread's updated_at
  const { error: updateError } = await supabase
    .from("threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", thread_id);
  if (updateError) {
    console.error("Failed to update thread timestamp:", updateError.message);
    // Not blocking response
  }

  return NextResponse.json(message, { status: 201 });
}
