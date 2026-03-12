"use client";

import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";

const ReactJson = dynamic(() => import("@smoosense/react-json-view"), {
  ssr: false,
});

interface JsonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: unknown;
  title: string;
}

export function JsonDialog({ open, onOpenChange, data, title }: JsonDialogProps) {
  const { resolvedTheme } = useTheme();
  const jsonTheme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-auto">
          <ReactJson
            src={data as object}
            theme={jsonTheme}
            displayDataTypes={false}
            enableClipboard
            collapsed={2}
            style={{ fontSize: 12, background: "transparent" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
