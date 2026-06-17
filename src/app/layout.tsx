import type { Metadata } from "next";
import { Orbitron, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Musicians — World-Class Music Learning & Networking Platform",
  description:
    "Join 50,000+ musicians on the world's most immersive music learning and networking platform. Master drums, guitar, violin, tabla and more with expert instructors.",
  keywords:
    "music learning, online drum lessons, guitar lessons, musician networking, tabla courses, music education, studio musicians",
  openGraph: {
    title: "Studio Musicians",
    description:
      "The world's most immersive music learning and networking platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="bg-[#050505] text-[#F0F0F0] antialiased overflow-x-hidden" suppressHydrationWarning>
        <FirebaseAnalytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
