"use client"
import { Card } from "@/components/ui/card"

export function ChatMessage({ role, contentHtml, raw }: { role: string; contentHtml?: string; raw?: string }) {
  return (
    <div>
      {(role === "ai" && contentHtml) ? (
        <div className="w-full p-4">
          <div className="prose dark:prose-invert prose-neutral max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </div>
      ) : (
        <Card className="p-4 ml-auto w-fit max-w-[60%] break-words">
          {raw}
        </Card>
      )}
    </div>
  )
}
