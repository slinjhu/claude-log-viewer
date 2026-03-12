"use client";

import dynamic from "next/dynamic";
import type { InitEntry } from "@/lib/types";
import { useTheme } from "@/components/theme-provider";

const ReactJson = dynamic(() => import("@smoosense/react-json-view"), {
  ssr: false,
});

export function SystemMessage({ entry }: { entry: InitEntry }) {
  const { resolvedTheme } = useTheme();
  const jsonTheme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <ReactJson
        src={entry.data}
        theme={jsonTheme}
        displayDataTypes={false}
        enableClipboard
        collapsed={1}
        name="data"
        style={{ fontSize: 12, background: "transparent" }}
      />
    </div>
  );
}
