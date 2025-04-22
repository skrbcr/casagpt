"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ChatInput({
  onSend,
  disabled = false,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) {
        onSend(input);
        setInput("");
      }
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Please wait..." : "Ask me questions on CASA"}
        className="flex-grow text-2xl p-2 leading-tight resize-none max-h-100 overflow-y-auto"
        disabled={disabled}
      />
      <Button
        onClick={() => {
          if (!disabled && input.trim()) {
            onSend(input);
            setInput("");
          }
        }}
        disabled={disabled}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </Button>
    </div>
  );
}
