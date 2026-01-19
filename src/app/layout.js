import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationListener from "@/components/NotificationListener";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "CTF | AdVitya 2026",
  description:
    "CTF Playground - Cyber Carnival - AdVitya 2026 - Capture The Flag",
  keywords: [
    "CTF",
    "CTF Playground",
    "Capture The Flag",
    "Cybersecurity",
    "VIT Bhopal",
    "CTF hosting",
    "ethical hacking",
    "infosec challenges",
  ],
  authors: [{ name: "Umair Malik", url: "https://nullvitbhopal.in" }],
  creator: "Umair Malik",
  publisher: "Umair Malik",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://null-hacksecure.vercel.app/",
  },
  openGraph: {
    title: "Cyber Carnival | AdVitya 2026",
    description:
      "Join CTF Playground by Null VIT Bhopal and compete in exciting cybersecurity challenges.",
    url: "https://null-hacksecure.vercel.app/",
    siteName: "CTF Playground",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "CTF Playground Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://null-hacksecure.vercel.app/"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          <NotificationListener />
          <Navbar />
          <main className="max-h-[90vh] max-w-screen relative sm:top-[79px] top-[60px]">
            {children}
          </main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
