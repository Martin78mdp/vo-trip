// components/admin/ItineraryTable.tsx

import React from 'react';

interface ItineraryLead {
    id: string;
    createdAt: string;
    status: 'PENDIENTE' | 'COTIZADO' | 'VENDIDO' | 'CANCELADO';
    departureCity: string | null;
    desiredDestinations: string;
    budgetPerPerson: string | null;
    durationDays: number | null;
    travelType: string | null;
    notes: string | null;
    name: string;
    email: string;
    phone: string;
}

interface ItineraryTableProps {
    leads: ItineraryLead[];
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

const getStatusColor = (status: ItineraryLead['status']) => {
    switch (status) {
        case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
        case 'COTIZADO': return 'bg-red-100 text-red-800'; // Destacamos este como servicio premium
        case 'VENDIDO': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function ItineraryTable({ leads }: ItineraryTableProps) {
    return (
        <div className="shadow-2xl overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-red-50"> {/* Usamos un color distintivo */}
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Recibida</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud de Itinerario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles de Viaje</th>
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
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                <p className="font-semibold">{lead.desiredDestinations}</p>
                                <p className="text-xs text-gray-500">Sale de: {lead.departureCity || '-'}</p>
                                <p className="text-xs text-gray-500">Notas: {lead.notes ? lead.notes.substring(0, 50) + '...' : 'Ninguna'}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <p className="font-medium">Presupuesto: {lead.budgetPerPerson || 'N/A'}</p>
                                <p className="text-xs text-gray-500">Duración: {lead.durationDays || '-'} días</p>
                                <p className="text-xs text-gray-500">Tipo: {lead.travelType}</p>
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