import { createClient} from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return NextResponse.json([], { status: 401 });
  }

  const { data: threadsRaw, error } = await supabase
    .from("threads")
    .select("id, title")
    .eq("user_id", authData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch threads:", error.message);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(threadsRaw ?? []);
}
