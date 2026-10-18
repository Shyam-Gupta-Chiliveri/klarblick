import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klarblick — Ihr Arztbrief. In Ruhe verstanden.",
  description:
    "KI übersetzt Entlassbriefe in nächste Schritte. Kein medizinischer Rat. EU-hosted via TrustedTokens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
