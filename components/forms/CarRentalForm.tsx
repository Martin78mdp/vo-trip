// components/forms/CarRentalForm.tsx

"use client";
import React, { useState } from 'react';

// Define la estructura de los datos para el envío al API
interface FormData {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  returnDate: string;
  carType: string;
  ageOfDriver: number | ''; // Permite número o cadena vacía
  name: string;
  email: string;
  phone: string;
}

export default function CarRentalForm() {
  const [formData, setFormData] = useState<FormData>({
    pickupLocation: '',
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
    carType: 'Economico', 
    ageOfDriver: 25, // Asumimos una edad común por defecto
    name: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string | null, type: 'success' | 'error' | null }>({ text: null, type: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        // Llama a tu nuevo endpoint /api/carrental
        const response = await fetch('/api/carrental', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend,
        });

        if (response.ok) {
            setMessage({ text: "✅ ¡Éxito! Solicitud de alquiler de auto enviada. Te contactaremos pronto.", type: 'success' });
            // Limpiar el formulario
            setFormData(prev => ({ 
                ...prev,
                pickupDate: '', returnDate: '', pickupLocation: '', returnLocation: '', 
                name: '', email: '', phone: '', ageOfDriver: 25 
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
      <h2 className="text-3xl font-bold text-center text-blue-800">Cotiza tu Alquiler de Auto 🚗</h2>
      <p className="text-center text-gray-600">Encuentra el vehículo perfecto para tu ruta.</p>

      {/* Mensaje de estado */}
      {message.text && (
        <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Ubicación Recogida / Devolución */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Lugar de Recogida</label>
          <input
            type="text"
            name="pickupLocation"
            id="pickupLocation"
            required
            value={formData.pickupLocation}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Aeropuerto de Bariloche (BRC)"
          />
        </div>
        <div>
          <label htmlFor="returnLocation" className="block text-sm font-medium text-gray-700">Lugar de Devolución</label>
          <input
            type="text"
            name="returnLocation"
            id="returnLocation"
            required
            value={formData.returnLocation}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Mismo lugar o Mendoza (MDZ)"
          />
        </div>
      </div>
      
      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Fecha y Hora de Recogida</label>
          <input
            type="datetime-local" // Usamos datetime-local para hora y fecha
            name="pickupDate"
            id="pickupDate"
            required
            value={formData.pickupDate}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Fecha y Hora de Devolución</label>
          <input
            type="datetime-local"
            name="returnDate"
            id="returnDate"
            required
            value={formData.returnDate}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Tipo de Auto / Edad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="carType" className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
            <select
                name="carType"
                id="carType"
                required
                value={formData.carType}
                onChange={handleChange}
                className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="Economico">Económico (Pequeño)</option>
                <option value="Sedan">Sedán (Mediano)</option>
                <option value="SUV">SUV / Camioneta</option>
                <option value="Familiar">Familiar / Van</option>
            </select>
        </div>
        <div>
          <label htmlFor="ageOfDriver" className="block text-sm font-medium text-gray-700">Edad del Conductor</label>
          <input
            type="number"
            name="ageOfDriver"
            id="ageOfDriver"
            min="18"
            max="99"
            value={formData.ageOfDriver}
            onChange={handleChange}
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="25"
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
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
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
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
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
            className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'BUSCANDO VEHÍCULO...' : 'SOLICITAR COTIZACIÓN DE AUTO'}
      </button>
    </form>
  );
}