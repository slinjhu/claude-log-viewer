import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude SDK Log Viewer",
  description: "View and explore Claude SDK logs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen overflow-hidden antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster
            toastOptions={{
              classNames: {
                success: "!bg-success !text-success-foreground !border-success",
                error: "!bg-destructive !text-destructive-foreground !border-destructive",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
