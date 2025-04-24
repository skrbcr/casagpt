import { auth } from "@/auth";
import HomeClient from "./home-client";
import Main from "@/components/main";

export default async function Home() {
  // Check if the user is authenticated
  const session = await auth();
  if (!session?.user) {
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

  return <HomeClient />;
}
