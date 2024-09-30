'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Importa los estilos de AOS
import { metadata } from './metadata';
import localFont from "next/font/local";
import "./globals.scss";
import { Sidebar, MobileNav } from "@/components/navbar/";
import Footer from "@/components/footer/footer";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de las animaciones
      once: true, // Si solo se debe animar una vez al hacer scroll
    });
  }, []);

  const actualRoute = usePathname();
  const hideSidebarPaths = ['/login', '/register'];

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col h-screen md:flex-row">
                {!hideSidebarPaths.includes(actualRoute) && (
                  <>
                    <div className="hidden md:block">
                      {/* <Sidebar /> */}
                      <Sidebar actualRoute={actualRoute} />
                    </div>
                    <div className="w-full p-5 md:hidden">
                      <MobileNav />
                    </div>
                  </>
                )}
                <div className="flex-grow md:ml-20">
                  <div className="flex flex-col h-full">
                    <main className="flex-grow">
                      {children}
                    </main>
                    <div className="w-full">
                      <Footer />
                    </div>
                  </div>
                </div>
              </div>
            </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
