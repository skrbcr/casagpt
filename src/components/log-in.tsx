"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/login")}>
      Login
    </Button>
  )
}
