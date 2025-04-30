import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

// POST /api/invite
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Service role key is not set" },
      { status: 500 }
    );
  }
  // Initialize Supabase client with service role key for admin actions
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    console.error("Invite error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
