// components/forms/ItineraryForm.tsx

"use client";
import React, { useState } from 'react';

// Define la estructura de los datos para el envío al API
interface FormData {
  departureCity: string;
  desiredDestinations: string;
  budgetPerPerson: string;
  durationDays: number | '';
  travelType: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
}

export default function ItineraryForm() {
  const [formData, setFormData] = useState<FormData>({
    departureCity: 'Buenos Aires',
    desiredDestinations: '',
    budgetPerPerson: 'Medio', // Valor por defecto
    durationDays: '',
    travelType: 'Cultural', // Valor por defecto
    notes: '',
    name: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
        let newValue: string | number | '' = value;
        
        if (type === 'number') {
            if (value === '') {
                newValue = ''; 
            } else {
                const parsed = parseInt(value, 10);
                newValue = isNaN(parsed) ? '' : parsed;
            }
        }

        return {
            ...prev,
            [name]: newValue,
        };
    });

    setMessage({ text: null, type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: null, type: null });

    const dataToSend = JSON.stringify(formData);

    try {
        // Llama a tu nuevo endpoint /api/itineraries
        const response = await fetch('/api/itineraries', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend,
        });

        if (response.ok) {
            setMessage({ text: "✅ ¡Éxito! Solicitud de viaje personalizado enviada. Empezaremos a diseñar tu ruta.", type: 'success' });
            // Limpiar campos esenciales
            setFormData(prev => ({ 
                ...prev,
                desiredDestinations: '', notes: '',
                name: '', email: '', phone: ''
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
    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-xl max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-red-700">Diseña tu Viaje a Medida en Argentina 🇦🇷</h2>
      <p className="text-center text-gray-600">
        Cuéntanos tus sueños de viaje y crearemos una ruta optimizada, incluyendo sugerencias de vuelos y alojamiento.
      </p>

      {/* Mensaje de estado */}
      {message.text && (
        <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Destinos e Intenciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="desiredDestinations" className="block text-sm font-medium text-gray-700">
            Destinos que te gustaría visitar (Ej: Salta, Iguazú, Ushuaia)
          </label>
          <input
            type="text"
            name="desiredDestinations"
            id="desiredDestinations"
            required
            value={formData.desiredDestinations}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            placeholder="Menciona ciudades, provincias o regiones de Argentina."
          />
        </div>
        
        <div>
          <label htmlFor="departureCity" className="block text-sm font-medium text-gray-700">Ciudad de Partida</label>
          <input
            type="text"
            name="departureCity"
            id="departureCity"
            value={formData.departureCity}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            placeholder="Ej: Buenos Aires"
          />
        </div>
        
        <div>
          <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">Duración (en días)</label>
          <input
            type="number"
            name="durationDays"
            id="durationDays"
            min="1"
            value={formData.durationDays}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            placeholder="Ej: 10"
          />
        </div>
      </div>
      
      {/* Presupuesto y Tipo de Viaje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="budgetPerPerson" className="block text-sm font-medium text-gray-700">Presupuesto Estimado (por persona)</label>
            <select
                name="budgetPerPerson"
                id="budgetPerPerson"
                required
                value={formData.budgetPerPerson}
                onChange={handleChange}
                className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            >
                <option value="Bajo">Bajo (Hostels / Low-cost)</option>
                <option value="Medio">Medio (Hoteles 3* / Cabañas)</option>
                <option value="Alto">Alto (Hoteles 4*+ / Lujo)</option>
            </select>
        </div>
        <div>
            <label htmlFor="travelType" className="block text-sm font-medium text-gray-700">Tipo de Viaje</label>
            <select
                name="travelType"
                id="travelType"
                required
                value={formData.travelType}
                onChange={handleChange}
                className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            >
                <option value="Aventura">Aventura / Trekking</option>
                <option value="Cultural">Cultural / Histórico</option>
                <option value="Familiar">Familiar con niños</option>
                <option value="Relax">Relax / Luna de Miel</option>
            </select>
        </div>
      </div>

      {/* Notas */}
      <div className="md:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notas Adicionales (¿Alguna restricción, interés especial, etc.?)
        </label>
        <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            placeholder="Ej: Solo podemos viajar en fin de semana, no nos gusta acampar."
        />
      </div>

      <hr className="my-6" />

      {/* Datos de Contacto */}
      <h3 className="text-xl font-semibold text-gray-700">Tu Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Los inputs de contacto deben coincidir con los del formulario de Alojamiento/Vuelos */}
        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label><input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500" /></div>
        <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500" /></div>
        <div className="md:col-span-2"><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label><input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500" /></div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'DIAGRAMANDO VIAJE...' : 'SOLICITAR DISEÑO DE ITINERARIO'}
      </button>
    </form>
  );
}