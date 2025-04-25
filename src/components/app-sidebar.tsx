import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Thread } from "@/types/thread";

export function AppSidebar({ chatThreads, message }: { chatThreads: Thread[], message?: string }) {
  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-muted p-4">
        <h2 className="text-lg font-semibold mb-4">Threads</h2>
        <ScrollArea className="h-full">
          <nav className="">
            {message ? (
              <div className="flex flex-1 items-center justify-center w-full h-full">
                <div className="text-center">
                  {message}
                </div>
              </div>
            ) : (
              chatThreads.map((thread) => (
                <Link key={thread.id} href={`?c=${thread.id}`} className="block">
                  <div className="p-2 rounded hover:bg-accent cursor-pointer transition-colors">
                    {thread.title}
                  </div>
                </Link>
              ))
            )}
          </nav>
        </ScrollArea>
      </aside>
    </div>
  );
}
