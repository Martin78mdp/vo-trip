// components/admin/AccommodationTable.tsx

import React from 'react';

// Tipos de datos deben coincidir con el modelo de Prisma
interface AccommodationLead {
    id: string;
    createdAt: string;
    status: 'PENDIENTE' | 'COTIZADO' | 'VENDIDO' | 'CANCELADO';
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    rooms: number | null;
    typeOfAccommodation: string;
    name: string;
    email: string;
    phone: string;
}

interface AccommodationTableProps {
    leads: AccommodationLead[];
    token: string;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const getStatusColor = (status: AccommodationLead['status']) => {
    switch (status) {
        case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
        case 'COTIZADO': return 'bg-blue-100 text-blue-800';
        case 'VENDIDO': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function AccommodationTable({ leads }: AccommodationTableProps) {
    return (
        <div className="shadow-2xl overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Recibida</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles Alojamiento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huéspedes / Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(lead.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <p className="font-semibold">{lead.destination}</p>
                                <p className="text-xs text-gray-500">Check-in: {formatDate(lead.checkInDate)}</p>
                                <p className="text-xs text-gray-500">Check-out: {formatDate(lead.checkOutDate)}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <p className="font-medium">Pax: {lead.guests} ({lead.rooms} Hab.)</p>
                                <p className="text-xs text-gray-500">Tipo: {lead.typeOfAccommodation}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <p>{lead.name}</p>
                                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 block text-xs">{lead.email}</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}