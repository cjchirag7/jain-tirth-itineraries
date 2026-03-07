import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jain Routes | Plan Your Tirth Yatra",
  description: "Share, discover, and plan detailed Jain Routes. Complete guides including Dharmshala and Bhojanshala information.",
  keywords: ["Jain", "Tirth", "Yatra", "Routes", "Itinerary", "Pilgrimage", "Dharmshala", "Bhojanshala", "Jainism", "Darshan"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
