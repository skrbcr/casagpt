import { createClient } from "@/utils/supabase/server";
import HomeClient from "./home-client";
import Main from "@/components/main";

interface HomePageProps {
  searchParams: { c?: string; share?: string };
}

export default async function Home(props: HomePageProps) {
  const { c, share } = props.searchParams;
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

  return (
    <HomeClient initialThreadId={c ?? share} shareMode={Boolean(share)} />
  );
}
