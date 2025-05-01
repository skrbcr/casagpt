import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Thread } from "@/types/thread";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";

export function AppSidebar({ chatThreads, message, onDelete, onRename }: { chatThreads: Thread[]; message?: string; onDelete?: (id: string) => void; onRename?: (id: string, title: string) => void }) {
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
                  {(onDelete || onRename) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-2 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={4} align="start">
                        {onRename && (
                          <DropdownMenuItem inset onClick={() => onRename(thread.id, thread.title)}>
                            <Pencil className="size-4" />
                            Rename title
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem inset variant="destructive" onClick={() => onDelete(thread.id)}>
                            <Trash className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
