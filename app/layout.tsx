import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prancha | Seu semestre de Medicina",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
