import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar({ chatThreads }: { chatThreads: { id: string; title: string }[] }) {
  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-muted p-4">
        <h2 className="text-lg font-semibold mb-4">Threads</h2>
        <ScrollArea className="h-full">
          <nav className="space-y-2">
            {chatThreads.map((thread) => (
              <Link key={thread.id} href={`?c=${thread.id}`} className="block">
                <div className="p-2 rounded hover:bg-accent cursor-pointer transition-colors">
                  {thread.title}
                </div>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </div>
  );
}
