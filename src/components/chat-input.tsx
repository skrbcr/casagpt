"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value)
    setValue("")
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="CASA に関する質問をどうぞ"
        className="flex-grow"
      />
      <Button onClick={handleSend}>送信</Button>
    </div>
  )
}
