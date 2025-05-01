"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    if (res.ok) {
      setMessage("招待メールを送信しました。");
      setEmail("");
    } else {
      setMessage(`エラー: ${json.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="mx-4 my-4">
      <form className="flex flex-1 space-x-2" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "送信中..." : "Invite"}
        </Button>
      </form>
      {message && <p className="mt-2 text-center">{message}</p>}
    </div>
  );
}
