import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import HeaderMenu from "@/components/header-menu";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "ChatGPT for CASA",
    template: "%s | ChatGPT for CASA",
  },
  description: "ChatGPT for CASA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

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
              <HeaderMenu isLoggedIn={Boolean(authData?.user)} />
            </header>

            {children}
          </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
