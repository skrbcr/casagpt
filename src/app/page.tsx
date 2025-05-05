import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import HomeClient from "./home-client";
import Main from "@/components/main";

export default async function Home({ searchParams }: { searchParams: Promise<{c?: string; share?: string }>}) {
  // searchParams must be awaited before use
  const { c, share } = await searchParams;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  // If not shared view and not authenticated, prompt login
  if (!share && !authData?.user) {
    if (c) {
      redirect("/");
    }
    return (
      <Main>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-2 p-4 w-full max-w-screen-lg text-center">
            <div className="text-2xl font-bold">
              Please login to use the app.
            </div>
          </div>
        </div>
      </Main>
    );
  }

  // Fetch thread title and shared status if a threadId is provided
  let initialThreadTitle: string | undefined;
  let initialIsShared = false;
  const threadId = c ?? share;
  if (threadId) {
    const { data: threadData, error: threadError } = await supabase
      .from('threads')
      .select('title, is_shared, user_id')
      .eq('id', threadId)
      .single();
    if (!threadError && threadData) {
      initialThreadTitle = threadData.title;
      initialIsShared = threadData.is_shared;
    }
    if (share && !threadData?.is_shared) {
      if (!!authData?.user?.id && authData?.user?.id == threadData?.user_id) {
        redirect(`/?c=${threadId}`);
      }
      else {
        redirect("/");
      }
    }
    if (c && authData?.user && threadData?.user_id !== authData.user.id) {
      redirect("/");
    }
    if (c && !threadData) {
      redirect("/");
    }

  }
  return (
    <HomeClient
      initialThreadId={threadId}
      shareMode={Boolean(share)}
      initialThreadTitle={initialThreadTitle}
      initialIsShared={initialIsShared}
    />
  );
}
