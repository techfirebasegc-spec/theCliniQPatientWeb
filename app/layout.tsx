import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../src/providers/AuthProvider";

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecliniq.co.in"), title: { default: "The CliniQ | Healthcare made clearer", template: "%s | The CliniQ" }, description: "Explore The CliniQ's public doctor and service directory.", icons: { icon: [{ url: "/brand/favicon.png", type: "image/png" }], apple: "/brand/favicon.png" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
