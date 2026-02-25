import "./globals.css";
import type { Metadata } from "next";
import Layout from "../components/Layout";

export const metadata: Metadata = {
  title: "KT.ai",
  description: "KT.ai - AI-powered Project Onboarding & Knowledge Transfer"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
