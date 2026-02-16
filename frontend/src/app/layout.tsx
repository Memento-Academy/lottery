import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weekend Lottery | Gasless On-Chain Game",
  description:
    "A fair, transparent on-chain lottery built with Foundry and Next.js",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-32x32.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
