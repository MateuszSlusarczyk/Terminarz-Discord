"use client";
import "./globals.css";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="h-full w-full">
      <body className="h-full w-full flex text-textMain">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
