import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar, SessionProvider} from '@/components/index';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BlockScan",
  description: "An effective smart contract scanner for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <SessionProvider>     
          <Navbar/>
          {children}
        </SessionProvider>     
      </body>
    </html>
  );
}