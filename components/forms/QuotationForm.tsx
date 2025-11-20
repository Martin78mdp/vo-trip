// components/forms/QuotationForm.tsx

"use client";
import React, { useState } from 'react';

// 1. Definición de tipos para TypeScript (SIN CAMBIOS)
interface FormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string; 
  passengers: number;
  name: string;
  email: string;
  phone: string;
}

export default function QuotationForm() {
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    destination: '',
    departureDate: '', 
    returnDate: '',
    passengers: 1,
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  // 2. FUNCIÓN DE ENVÍO CORREGIDA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = JSON.stringify(formData); 
    
    // CORRECCIÓN CLAVE: Forzamos el tipo a HTMLButtonElement para que TypeScript acepte '.disabled'
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    
    // Desactivamos el formulario temporalmente
    if (submitButton) {
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true; // TypeScript ya no se queja aquí
    }

    try {
        const response = await fetch('/api/leads', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend,
        });

        if (response.ok) {
            alert("✅ ¡Éxito! Tu solicitud de cotización ha sido guardada. Nos contactaremos pronto.");
            setFormData({ origin: '', destination: '', departureDate: '', returnDate: '', passengers: 1, name: '', email: '', phone: '' }); 

        } else {
            const errorData = await response.json();
            alert(`⚠️ Error al enviar la solicitud: ${errorData.error || 'Problema desconocido.'}`);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("❌ Error de conexión. Revisa tu internet o inténtalo más tarde.");
    } finally {
        // Restaura el botón sin importar el resultado
        if (submitButton) {
            submitButton.textContent = 'SOLICITAR COTIZACIÓN';
            submitButton.disabled = false;
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-xl max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-800">Cotiza tu Vuelo Aquí</h2>
      <p className="text-center text-gray-600">Completa los datos y te encontraremos el mejor precio.</p>
      
      {/* Grid de Origen y Destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origen</label>
          <input
            type="text"
            name="origin"
            id="origin"
            required
            value={formData.origin}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Buenos Aires (EZE)"
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino</label>
          <input
            type="text"
            name="destination"
            id="destination"
            required
            value={formData.destination}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Madrid (MAD)"
          />
        </div>
      </div>

      {/* Fechas y Pasajeros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Fecha de Ida</label>
          <input
            type="date"
            name="departureDate"
            id="departureDate"
            required
            value={formData.departureDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Fecha de Vuelta (Opcional)</label>
          <input
            type="date"
            name="returnDate"
            id="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Pasajeros</label>
          <input
            type="number"
            name="passengers"
            id="passengers"
            required
            min="1"
            max="10"
            value={formData.passengers}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <hr className="my-6" />

      {/* Datos de Contacto */}
      <h3 className="text-xl font-semibold text-gray-700">Tu Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Martín V."
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ejemplo@email.com"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (con código de área)</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+54 9 11 XXXX-XXXX"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
      >
        SOLICITAR COTIZACIÓN
      </button>
    </form>
  );
}