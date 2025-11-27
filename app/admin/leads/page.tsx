// app/admin/leads/page.tsx - INTERFAZ UNIFICADA FINAL
export const dynamic = "force-dynamic";

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import React from 'react';

// Importar los componentes de tabla
import FlightLeadsTable from '@/components/admin/FlightLeadsTable';
import AccommodationTable from '@/components/admin/AccommodationTable';
import CarRentalTable from '@/components/admin/CarRentalTable';
import ItineraryTable from '@/components/admin/ItineraryTable';

// Tipos genéricos para el fetch de leads
interface LeadCommon { id: string; createdAt: string; status: string; name: string; email: string; phone: string; }

// ---------------------------------------------------------
// FUNCIÓN GETLEADS — VERSIÓN FINAL (CORREGIDA PARA VERCEL)
// ---------------------------------------------------------
async function getLeads(endpoint: 'leads' | 'accommodation' | 'carrental' | 'itineraries') {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) {
        console.error("ADMIN_TOKEN no configurado.");
        notFound();
    }

    const baseUrl = process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    // ❗ Token YA NO SE PASA POR URL
    const apiUrl = `${baseUrl}/api/admin/${endpoint}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',          // 🔥 evita cualquier cacheo
            headers: {
                Authorization: `Bearer ${ADMIN_TOKEN}`, // 🔥 token seguro
            },
        });

        if (response.status === 401) {
            console.error(`Token inválido para endpoint: ${endpoint}`);
            notFound();
        }

        if (!response.ok) {
            throw new Error(`Error al obtener leads de ${endpoint}: ${response.statusText}`);
        }

        return response.json();

    } catch (error) {
        console.error(`Error de red o API para ${endpoint}:`, error);
        notFound();
    }
}

// ---------------------------------------------------------
// DEFINICIÓN DE PESTAÑAS
// ---------------------------------------------------------
const TABS = {
    vuelos: { label: 'Vuelos', endpoint: 'leads', component: FlightLeadsTable },
    alojamiento: { label: 'Alojamiento', endpoint: 'accommodation', component: AccommodationTable },
    autos: { label: 'Alquiler de Autos', endpoint: 'carrental', component: CarRentalTable },
    itinerarios: { label: 'Diseño de Viaje (Valor)', endpoint: 'itineraries', component: ItineraryTable },
} as const;

// ---------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------
export default async function AdminLeadsPage({
    searchParams,
}: {
    searchParams: { tab?: keyof typeof TABS };
}) {

    // 1. Determinar pestaña activa
    const activeTabKey = (searchParams.tab || 'vuelos') as keyof typeof TABS;
    const activeTab = TABS[activeTabKey] || TABS.vuelos;

    // 2. Validar token del entorno
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    if (!ADMIN_TOKEN) notFound();

    // 3. Obtener leads de la pestaña
    const leads: any[] = await getLeads(activeTab.endpoint);
    const TotalLeads = leads.length;

    // 4. Asignar componente dinámico
    const LeadsComponent = activeTab.component;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-blue-900">
                    Panel de Administración Unificado
                </h1>
                <div className="text-sm text-gray-500">
                    Mostrando Leads: <span className="font-bold text-lg text-blue-600">{TotalLeads}</span>
                </div>
            </header>

            {/* Navegación por Pestañas */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {(Object.keys(TABS) as Array<keyof typeof TABS>).map((key) => {
                        const tab = TABS[key];
                        const isActive = key === activeTabKey;
                        return (
                            <Link
                                key={key}
                                href={`/admin/leads?tab=${key}`}
                                className={`
                                    ${isActive
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                `}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Contenido */}
            <Suspense fallback={<div>Cargando leads...</div>}>
                {TotalLeads === 0 ? (
                    <div className="text-center p-10 bg-white shadow rounded-lg text-gray-600">
                        No se encontraron leads para esta categoría ({activeTab.label}).
                    </div>
                ) : (
                    <LeadsComponent leads={leads as any} token={ADMIN_TOKEN} />
                )}
            </Suspense>
        </div>
    );
}
