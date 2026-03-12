"use client";

import { SettingsDropdown } from "@/components/settings-dropdown";

export function Navbar() {
  return (
    <nav className="flex items-center border-b px-4 h-12">
      <span className="text-lg font-bold">Claude SDK Log Viewer</span>
      <div className="ml-auto flex items-center gap-1">
        <SettingsDropdown />
      </div>
    </nav>
  );
}
