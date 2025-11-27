// components/admin/CarRentalTable.tsx

import React from 'react';

interface CarRentalLead {
    id: string;
    createdAt: string;
    status: 'PENDIENTE' | 'COTIZADO' | 'VENDIDO' | 'CANCELADO';
    pickupLocation: string;
    returnLocation: string;
    pickupDate: string;
    returnDate: string;
    carType: string | null;
    ageOfDriver: number | null;
    name: string;
    email: string;
    phone: string;
}

interface CarRentalTableProps {
    leads: CarRentalLead[];
    token: string;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    // Muestra la fecha y HORA de recogida/devolución
    return new Date(dateString).toLocaleTimeString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusColor = (status: CarRentalLead['status']) => {
    switch (status) {
        case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
        case 'COTIZADO': return 'bg-blue-100 text-blue-800';
        case 'VENDIDO': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function CarRentalTable({ leads }: CarRentalTableProps) {
    return (
        <div className="shadow-2xl overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Recibida</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta de Alquiler</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles Vehículo</th>
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
                                <p className="font-semibold">{lead.pickupLocation} → {lead.returnLocation}</p>
                                <p className="text-xs text-gray-500">Recogida: {formatDate(lead.pickupDate)}</p>
                                <p className="text-xs text-gray-500">Devolución: {formatDate(lead.returnDate)}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <p className="font-medium">{lead.carType}</p>
                                <p className="text-xs text-gray-500">Edad Conductor: {lead.ageOfDriver || '-'}</p>
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