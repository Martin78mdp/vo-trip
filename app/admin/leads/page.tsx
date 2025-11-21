// app/admin/leads/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';

// Definición de tipos para los datos (igual que en el API)
interface Lead {
  id: string;
  status: 'PENDIENTE' | 'COTIZADO' | 'VENDIDO';
  createdAt: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string | null;
  passengers: number;
  name: string;
  email: string;
  phone: string;
}

// Función que obtiene los leads (Se ejecuta en el servidor)
async function getLeads(): Promise<Lead[]> {
  // 1. OBTENEMOS EL TOKEN del entorno VERCEL
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  
  // En Next.js, forzamos que si no hay token (por seguridad), la página de un error 404
  if (!ADMIN_TOKEN) {
    console.error("ADMIN_TOKEN no configurado.");
    notFound(); 
  }

  // 2. Construir la URL de la API con el token
  // Usamos un truco de Next.js para referenciar el entorno de producción/local
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.VERCEL_URL}` // URL de producción real en Vercel
    : 'http://localhost:3000'; // URL local en desarrollo
    
  const apiUrl = `${baseUrl}/api/admin/leads?token=${ADMIN_TOKEN}`;
  
  try {
    const response = await fetch(apiUrl, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store' // CRUCIAL: siempre obtener datos frescos
    });

    // Si la API devuelve 401 (Acceso Denegado), mostramos 404
    if (response.status === 401) {
      console.error("Token de administración inválido.");
      notFound();
    }
    
    if (!response.ok) {
      throw new Error(`Error al obtener leads: ${response.statusText}`);
    }

    return response.json();

  } catch (error) {
    console.error("Error al obtener leads:", error);
    notFound(); 
  }
}

// Componente principal que renderiza la tabla
export default async function AdminLeadsPage() {
  // Llama a la función que obtiene los datos antes de renderizar
  const leads = await getLeads();

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'COTIZADO': return 'bg-blue-100 text-blue-800';
      case 'VENDIDO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-blue-900">
          Panel de Administración de Cotizaciones
        </h1>
        <div className="text-sm text-gray-500">
          Total de Leads: <span className="font-bold text-lg text-blue-600">{leads.length}</span>
        </div>
      </header>

      {leads.length === 0 ? (
        <div className="text-center p-10 bg-white shadow rounded-lg">
          <p className="text-xl text-gray-500">Aún no hay cotizaciones guardadas.</p>
        </div>
      ) : (
        <div className="shadow-2xl overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Recibida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta / Pasajeros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.id.substring(0, 6)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <p className="font-semibold">{lead.origin} → {lead.destination}</p>
                    <p className="text-xs text-gray-500">Ida: {formatDate(lead.departureDate)}</p>
                    <p className="text-xs text-gray-500">Vuelta: {formatDate(lead.returnDate)}</p>
                    <p className="text-xs text-gray-500 font-medium">Pax: {lead.passengers}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 block">{lead.email}</a>
                    <a href={`tel:${lead.phone}`} className="text-green-600 hover:text-green-800 block">{lead.phone}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}