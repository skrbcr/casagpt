"use client";
import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import Main from "@/components/main";

export default function Home() {

  const [messages, setMessages] = useState([
    { role: "user", content: "Hello, how are you?" },
    {
      role: "ai",
      content: `
## tcleanを用いた実装
## tcleanのインストール
これは、tcleanを用いた実装の例です。まず、tcleanをインストールします。
\`\`\`bash
pip install tclean
\`\`\``},
  ]);

  return (
    <Main>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
      </div>

      <div className="border-t px-4 py-3">
        <ChatInput onSend={(message) => {
          setMessages([...messages, { role: "user", content: message }]);
        }} />
      </div>
    </Main>
  );
}
