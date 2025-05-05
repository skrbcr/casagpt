"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogIn from "@/components/log-in";
import LogOut from "@/components/log-out";
import { ModeToggle } from "@/components/mode-toggle";
import { MoreVertical } from "lucide-react";

interface HeaderMenuProps {
  isLoggedIn: boolean;
}

export default function HeaderMenu({ isLoggedIn }: HeaderMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2">
        <div className="mx-4">
          <Link href="/about" className="text-base hover:underline">
            About
          </Link>
        </div>
        {isLoggedIn ? <LogOut /> : <LogIn />}
        <ModeToggle />
      </div>
      <div className="flex sm:hidden items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            {isLoggedIn ? (
              <DropdownMenuItem>
                <LogOut />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <LogIn />
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
