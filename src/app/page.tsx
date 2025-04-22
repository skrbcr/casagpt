"use client";
import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import Main from "@/components/main";
import { parseMarkdown } from "@/lib/parseMarkdown";
import 'katex/dist/katex.min.css';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string; contentHtml?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);

  const handleSend = async (message: string) => {
    const userMessage = { role: "user", content: message } as const;
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          previous_response_id: previousResponseId,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setPreviousResponseId(data.result.id);
        const parsed = await parseMarkdown(data.result.output_text);
        const aiMessage = {
          role: "ai" as const,
          content: data.result.output_text,
          contentHtml: parsed,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", content: "Error: No response" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error: Failed to fetch" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Main>
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        <div className="max-w-screen-lg mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              contentHtml={message.contentHtml}
              raw={message.content}
            />
          ))}
          {isLoading && <ChatMessage role="ai" contentHtml="<p>Thinking...</p>" />}
        </div>
      </div>

      <div className="border-t px-4 py-3 sticky bottom-0 w-full">
        <div className="max-w-screen-lg mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </Main>
  );
}
