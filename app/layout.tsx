import type { Metadata } from "next";
import "./globals.css";
import AccessAnalytics from "./access-analytics";

export const metadata: Metadata = {
  title: "Portal Prancha",
  description: "Conteúdo, prática e progresso individual de Medicina 2026.2.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}{process.env.VERCEL_ENV === "production" && <AccessAnalytics />}</body>
    </html>
  );
}
