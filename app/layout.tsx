import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. IMPORTAMOS EL HEADER. Asegúrate de que la ruta sea correcta
import Header from '@/components/layout/Header'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. ACTUALIZAMOS EL METADATA para el SEO de tu proyecto
export const metadata: Metadata = {
  title: "Agencia de Pasajes Aéreos - Cotiza tu Vuelo",
  description: "Encuentra y cotiza tus pasajes aéreos de forma rápida y con soporte personalizado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        // 3. Mantenemos las clases de fuente de Geist
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 4. INSERTAMOS EL HEADER ANTES DEL CONTENIDO */}
        <Header /> 
        
        {/* 5. ENVOLVEMOS EL CONTENIDO {children} EN UN MAIN */}
        <main className="min-h-screen bg-gray-50 py-12">
            {children}
        </main>
      </body>
    </html>
  );
}