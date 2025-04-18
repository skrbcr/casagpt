import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "CASA GPT",
  description: "ChatGPT for CASA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              <h1 className="text-2xl font-bold">CASA GPT</h1>
              <ModeToggle />
            </header>

            {children}
          </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
