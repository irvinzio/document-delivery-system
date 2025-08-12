"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}> 
        <SessionProvider>
          <ThemeProvider theme={createTheme()}>
            <CssBaseline />
            <NavbarWrapper />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
