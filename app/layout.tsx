import type { Metadata } from "next";
import { Jost, Newsreader } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", adjustFontFallback: false });

export const metadata: Metadata = {
  title: "L R Ferreira — Advocacia e Consultoria Jurídica",
  description: "Assessoria jurídica para pessoas e empresas em diferentes áreas do Direito. Atendimento próximo, clareza e responsabilidade em cada decisão."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${jost.variable} ${newsreader.variable}`}>{children}</body>
    </html>
  );
}
