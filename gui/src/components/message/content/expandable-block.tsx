"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableBlockProps {
  className?: string;
  icon: React.ReactNode;
  label: string;
  pills?: React.ReactNode;
  expandedPills?: React.ReactNode;
  preview: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ExpandableBlock({
  className,
  icon,
  label,
  pills,
  expandedPills,
  preview,
  actions,
  children,
}: ExpandableBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-md border text-sm", className)}>
      <div className="flex items-center gap-1.5 px-3 py-2">
        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        </button>
        {icon}
        {open && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
        {pills}
        {open && expandedPills}
        {!open && (
          <span className="flex-1 min-w-0 truncate text-xs font-mono">
            {preview}
          </span>
        )}
        {actions}
      </div>
      {open && (
        <div className="px-3 pb-2">
          {children}
        </div>
      )}
    </div>
  );
}
