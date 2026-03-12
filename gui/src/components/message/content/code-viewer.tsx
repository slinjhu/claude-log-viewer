"use client";

import { useEffect, useRef } from "react";
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { LanguageSupport, foldGutter, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "@/components/theme-provider";

// Language imports
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";

const LANG_MAP: Record<string, () => LanguageSupport> = {
  js: () => javascript(),
  jsx: () => javascript({ jsx: true }),
  ts: () => javascript({ typescript: true }),
  tsx: () => javascript({ jsx: true, typescript: true }),
  mjs: () => javascript(),
  cjs: () => javascript(),
  py: () => python(),
  json: () => json(),
  jsonl: () => json(),
  html: () => html(),
  htm: () => html(),
  css: () => css(),
  scss: () => css(),
  md: () => markdown(),
  mdx: () => markdown(),
  rs: () => rust(),
  c: () => cpp(),
  cpp: () => cpp(),
  cc: () => cpp(),
  h: () => cpp(),
  hpp: () => cpp(),
  java: () => java(),
  xml: () => xml(),
  svg: () => xml(),
  sql: () => sql(),
  yaml: () => yaml(),
  yml: () => yaml(),
  toml: () => yaml(),
};

function getLangFromPath(filePath: string): LanguageSupport | null {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  const factory = LANG_MAP[ext];
  return factory ? factory() : null;
}

interface CodeViewerProps {
  code: string;
  filePath: string;
}

export function CodeViewer({ code, filePath }: CodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      EditorView.editable.of(false),
      EditorView.lineWrapping,
      lineNumbers(),
      foldGutter(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    ];

    const lang = getLangFromPath(filePath);
    if (lang) extensions.push(lang);

    if (resolvedTheme === "dark") {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: code,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [code, filePath, resolvedTheme]);

  return <div ref={containerRef} className="text-xs overflow-auto" />;
}
