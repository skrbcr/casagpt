import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";

export const metadata: Metadata = {
  title: "ChatGPT for CASA",
  description: "ChatGPT for CASA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="flex flex-col h-screen">
            <header className="fixed top-0 left-0 w-full bg-[var(--background)] z-50 py-4 px-6 flex justify-between items-center text-sm shadow-sm">
              <h1 className="text-2xl font-bold">
                <Link href="/">
                  ChatGPT for CASA
                </Link>
              </h1>
              <div className="flex items-center gap-2">
                <div className="mx-4">
                  <Link href="/about" className="text-base hover:underline">About</Link>
                </div>
                {session?.user ? (
                  <SignOut />
                ) : (
                  <SignIn />
                )}
                <ModeToggle />
              </div>
            </header>

            {children}
          </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
