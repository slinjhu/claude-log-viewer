"use client";

import { Navbar } from "@/components/navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex flex-col flex-1 min-h-0 p-6 gap-4">
        {children}
      </main>
    </div>
  );
}
