import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { montserrat } from "./fonts/fonts";
import "./globals.css";
import Navbar from './ui/navbar'
import Footer from './ui/footer'

export const metadata: Metadata = {
  title: "Dental Scheduler",
  description: "Schedule your Dental Appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
          <body
            className={`${montserrat.className} antialiased`}
          >
              <div className="min-h-screen flex flex-col">
                <Navbar/>
                <div className="flex flex-grow flex-col">
                  {children}
                </div>
                <Footer/>
              </div>
          </body>
      </html>
    </AuthProvider>
  );
}
