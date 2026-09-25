import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../src/providers/AuthProvider";

export const metadata: Metadata = {
  title: "TheCliniQ Patient",
  description: "TheCliniQ patient application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
