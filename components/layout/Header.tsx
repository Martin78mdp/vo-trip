// components/layout/Header.tsx

import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Nombre de la Marca */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-150">
          ✈️ [Tu Agencia de Vuelos]
        </Link>
        
        {/* Navegación Principal (Visible en desktop) */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/cotizar" className="text-gray-700 hover:text-blue-600 font-medium transition duration-150">
            Cotizar Viaje
          </Link>
          <Link href="/nosotros" className="text-gray-700 hover:text-blue-600 font-medium transition duration-150">
            Sobre Nosotros
          </Link>
          <Link href="/legal" className="text-gray-700 hover:text-blue-600 font-medium transition duration-150">
            Términos
          </Link>
          
          {/* Botón de Acción Principal (Destacado) */}
          <Link 
            href="/cotizar"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md"
          >
            ¡Solicita tu Vuelo!
          </Link>
        </div>

        {/* Botón de Acción Principal (Para Móviles, ocultar el menú de navegación completo por ahora) */}
        <Link 
          href="/cotizar"
          className="md:hidden bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md"
        >
          Cotizar
        </Link>
      </nav>
    </header>
  );
}