"use client";

import { useSearchParams } from "next/navigation";
import { SettingsDropdown } from "@/components/settings-dropdown";

export function Navbar() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");

  return (
    <nav className="flex items-center border-b px-4 h-12 gap-3">
      <span className="text-sm font-bold whitespace-nowrap">Claude SDK Log Viewer</span>
      {filePath && (
        <span className="text-xs font-mono text-muted-foreground truncate">
          {filePath}
        </span>
      )}
      <div className="ml-auto flex items-center gap-1 shrink-0">
        <SettingsDropdown />
      </div>
    </nav>
  );
}
