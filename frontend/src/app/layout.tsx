import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lottery | Built with Foundry",
  description:
    "A fair, transparent on-chain lottery built with Foundry and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
