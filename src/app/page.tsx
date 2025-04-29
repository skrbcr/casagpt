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
    return (
      <Main>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-2 p-4 max-w-screen-lg text-center">
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
      .select('title, is_shared')
      .eq('id', threadId)
      .single();
    if (!threadError && threadData) {
      initialThreadTitle = threadData.title;
      initialIsShared = threadData.is_shared;
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
