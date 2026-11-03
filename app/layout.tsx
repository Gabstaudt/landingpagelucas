import type { Metadata } from "next";
import { Jost, Newsreader } from "next/font/google";
import "./globals.css";
import { siteUrl, siteName, siteTitle, siteDescription, structuredData } from "@/lib/seo";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Lucas Ruan Ferreira Gomes", url: `${siteUrl}/#sobre` }],
  creator: "Lucas Ruan Ferreira Gomes",
  publisher: siteName,
  category: "Serviços jurídicos",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: "L R Ferreira Advocacia — Lucas Ruan Ferreira Gomes, OAB/PA 43.942" }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: `${siteUrl}/og-image.png`, alt: "L R Ferreira Advocacia — Lucas Ruan Ferreira Gomes, OAB/PA 43.942" }]
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${jost.variable} ${newsreader.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
