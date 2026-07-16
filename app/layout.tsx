import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SandhyaProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SANDHYA — Seventy-five dawns. One crossing.",
  description:
    "A 75-day transformation compass. The threshold is the temple.",
  applicationName: "SANDHYA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SANDHYA",
  },
};

export const viewport: Viewport = {
  themeColor: "#141733",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SandhyaProvider>{children}</SandhyaProvider>
      </body>
    </html>
  );
}
