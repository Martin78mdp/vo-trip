// components/forms/AccommodationForm.tsx

"use client";
import React, { useState } from 'react';

// Define la estructura de los datos
interface FormData {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number | ''; // Permite número o cadena vacía
  typeOfAccommodation: string;
  name: string;
  email: string;
  phone: string;
}

export default function AccommodationForm() {
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    rooms: '', 
    typeOfAccommodation: 'Hotel', // Valor inicial
    name: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => {
        let newValue: string | number = value; // Iniciamos el nuevo valor con la cadena (value)

        if (type === 'number') {
            // Lógica robusta para números:
            
            // 1. Si el campo está vacío, lo forzamos a 0. El 'min="1"' en el JSX lo validará.
            if (value === '') {
                newValue = 0; 
            } else {
                // 2. Intentamos convertir a entero. Si falla (NaN), usamos 0.
                const parsed = parseInt(value, 10);
                newValue = isNaN(parsed) ? 0 : parsed;
            }
        }

        return {
            ...prev,
            [name]: newValue,
        };
    });

    // Limpiamos el mensaje de error o éxito al empezar a escribir
    setMessage({ text: null, type: null });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: null, type: null });

    const dataToSend = JSON.stringify(formData);

    try {
        // Llama a tu nuevo endpoint /api/accommodation
        const response = await fetch('/api/accommodation', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend,
        });

        if (response.ok) {
            setMessage({ text: "✅ ¡Éxito! Solicitud de alojamiento enviada. Te contactaremos pronto.", type: 'success' });
            // Limpiar el formulario
            setFormData(prev => ({ 
                ...prev,
                checkInDate: '', checkOutDate: '', destination: '', rooms: '', 
                name: '', email: '', phone: '', guests: 1 
            })); 

        } else {
            const errorData = await response.json();
            setMessage({ text: `⚠️ Error al enviar: ${errorData.error || 'Problema desconocido.'}`, type: 'error' });
        }
    } catch (error) {
        console.error("Error de red:", error);
        setMessage({ text: "❌ Error de conexión. Inténtalo más tarde.", type: 'error' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-xl max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-800">Cotiza tu Alojamiento</h2>
      <p className="text-center text-gray-600">Buscaremos el mejor hotel, departamento o casa para tu viaje.</p>

      {/* Mensaje de estado */}
      {message.text && (
        <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Detalles de la Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino (Ciudad o Zona)</label>
          <input
            type="text"
            name="destination"
            id="destination"
            required
            value={formData.destination}
            onChange={handleChange}
            className="force-input-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Ushuaia, CABA, Bariloche"
          />
        </div>
        
        {/* Check-in / Check-out */}
        <div>
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">Fecha de Check-in</label>
          <input
            type="date"
            name="checkInDate"
            id="checkInDate"
            required
            value={formData.checkInDate}
            onChange={handleChange}
            className="force-input-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">Fecha de Check-out</label>
          <input
            type="date"
            name="checkOutDate"
            id="checkOutDate"
            required
            value={formData.checkOutDate}
            onChange={handleChange}
            className="force-input-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Huéspedes / Habitaciones / Tipo de Alojamiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Huéspedes</label>
          <input
            type="number"
            name="guests"
            id="guests"
            required
            min="1"
            max="20"
            value={formData.guests}
            onChange={handleChange}
            className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">Habitaciones (Opcional)</label>
          <input
            type="number"
            name="rooms"
            id="rooms"
            min="1"
            value={formData.rooms}
            onChange={handleChange}
            className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
            <label htmlFor="typeOfAccommodation" className="block text-sm font-medium text-gray-700">Tipo de Alojamiento</label>
            <select
                name="typeOfAccommodation"
                id="typeOfAccommodation"
                required
                value={formData.typeOfAccommodation}
                onChange={handleChange}
                className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="Hotel">Hotel / Apart-Hotel</option>
                <option value="Departamento">Departamento / Alquiler Vacacional</option>
                <option value="Casa">Casa / Cabaña</option>
                <option value="Hostel">Hostel</option>
            </select>
        </div>
      </div>


      <hr className="my-6" />

      {/* Datos de Contacto (Igual que el formulario de vuelos) */}
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
            className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
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
            className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ejemplo@email.com"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="force-input-black text-grey-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+54 9 11 XXXX-XXXX"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'BUSCANDO ALOJAMIENTO...' : 'SOLICITAR COTIZACIÓN DE ALOJAMIENTO'}
      </button>
    </form>
  );
}