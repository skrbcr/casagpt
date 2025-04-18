import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"

export function ChatMessage({ role, content }: { role: string; content: string }) {
  return (
    <div>
      {role === "ai" ? (
        <div className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.trim()}
          </ReactMarkdown>
        </div>
      ) : (
        <Card className="p-4 ml-auto w-fit max-w-[60%]">
          {content}
        </Card>
      )}
    </div>
  )
}
