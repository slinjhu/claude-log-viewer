"use client";

import { useState } from "react";
import { Braces } from "lucide-react";
import { JsonDialog } from "@/components/log/json-dialog";

interface JsonButtonProps {
  data: unknown;
  title: string;
}

export function JsonButton({ data, title }: JsonButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-auto shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
        title="View raw JSON"
      >
        <Braces className="h-3.5 w-3.5" />
      </button>
      {open && (
        <JsonDialog
          open={open}
          onOpenChange={setOpen}
          data={data}
          title={title}
        />
      )}
    </>
  );
}
