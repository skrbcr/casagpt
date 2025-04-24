import { logout } from "@/lib/auth-actions";
import { Button } from "./ui/button";

export default function LogOut() {
  return (
    <form>
      <Button
        type="submit"
        formAction={logout}
      >
        Logout
      </Button>
    </form>
  );
}
