import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Main from "@/components/main";
import InviteForm from "@/components/invite-form";

export const metadata: Metadata = {
  title: "Administration",
  description: "Admin page for managing users and settings.",
};

export default async function Admin() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const { data: adminData } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", authData?.user?.id)
    .single();
  const isAdmin = adminData?.is_admin;

  // Check if the user is admin
  if (!isAdmin) return notFound();

  return (
    <Main>
      <div className="flex h-full">
        <div className="space-y-2 p-4 max-w-screen-lg">
          <div className="text-2xl font-bold">Administration</div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">User Invitation</h2>
            <InviteForm />
          </section>
        </div>
      </div>
    </Main>
  );
}
