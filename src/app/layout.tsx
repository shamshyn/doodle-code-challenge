import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Doodle Chat",
  description: "Simple chat interface for Doodle challenge",
};

export const icons = {
  icon: "/favicon.ico",
  apple: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href={icons.icon} />
        <link rel="apple-touch-icon" href={icons.apple} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
