import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Thread } from "@/types/thread";

export function AppSidebar({ chatThreads, message, onDelete }: { chatThreads: Thread[]; message?: string; onDelete?: (id: string) => void }) {
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
                <div key={thread.id} className="flex items-center justify-between">
                  <Link
                    href={`?c=${thread.id}`}
                    className="flex-grow block p-2 rounded hover:bg-accent cursor-pointer transition-colors"
                  >
                    {thread.title}
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(thread.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </nav>
        </ScrollArea>
      </aside>
    </div>
  );
}
