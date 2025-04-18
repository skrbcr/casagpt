import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 mx-auto w-full max-w-screen-lg px-4 sm:px-4 lg:px-6 pt-14 pb-2 flex flex-col">
      {children}
    </main>
  );
}
