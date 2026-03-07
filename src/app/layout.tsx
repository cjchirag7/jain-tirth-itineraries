import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import ChatAssistant from "@/components/ChatAssistant";

export const metadata: Metadata = {
  metadataBase: new URL('https://jainroutes.com'),
  title: "Jain Routes | Plan Your Tirth Yatra",
  description: "Share, discover, and plan detailed Jain Routes. Complete guides including Dharmshala and Bhojanshala information.",
  keywords: ["Jain", "Tirth", "Yatra", "Routes", "Itinerary", "Pilgrimage", "Dharmshala", "Bhojanshala", "Jainism", "Darshan"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Jain Routes | Plan Your Tirth Yatra",
    description: "Share, discover, and plan detailed Jain Routes. Complete guides including Dharmshala and Bhojanshala information.",
    url: "https://jainroutes.com",
    siteName: "Jain Routes",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Jain Routes Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F2MGPTFDDH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F2MGPTFDDH');
          `}
        </Script>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatAssistant />
      </body>
    </html>
  );
}
