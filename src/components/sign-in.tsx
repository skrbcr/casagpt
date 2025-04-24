import { signIn } from "@/auth"
import { Button } from "./ui/button"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("auth0")
      }}
    >
      <Button type="submit">Login</Button>
    </form>
  )
} 
