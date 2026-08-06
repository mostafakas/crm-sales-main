import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const jannaRegular = localFont({
  src: "../public/fonts/janna-reg.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-janna-regular",
  display: "swap",
});

const jannaBold = localFont({
  src: "../public/fonts/janna-bold.ttf",
  weight: "700",
  style: "normal",
  variable: "--font-janna-bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Almaster HR System",
  description: "Almaster HR System",
};

import { ReduxProvider } from "@/lib/store/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jannaRegular.variable} ${jannaBold.variable} h-full antialiased font-sans`}>
      <head>
        <link
          rel="stylesheet"
          href="https://www.fontstatic.com/fonts/janna-lt/janna-lt.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
