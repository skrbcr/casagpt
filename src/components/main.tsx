import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen mx-auto w-full pt-14 pb-2">
      {children}
    </main>
  );
}
