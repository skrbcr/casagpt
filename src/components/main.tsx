import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen mx-auto w-full pt-16 p-4">
      {children}
    </main>
  );
}
