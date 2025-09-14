import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Quiz Board",
  description: "Generate Jeopardy-style quiz boards from a topic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
