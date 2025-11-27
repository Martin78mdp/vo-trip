// app/admin/leads/page.tsx - INTERFAZ UNIFICADA FINAL

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

// Función de fetch genérica para las 4 APIs
async function getLeads(endpoint: 'leads' | 'accommodation' | 'carrental' | 'itineraries') {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) {
        console.error("ADMIN_TOKEN no configurado.");
        notFound(); 
    }

    // Definición de la URL base para el entorno local y de producción
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
        
    const apiUrl = `${baseUrl}/api/admin/${endpoint}?token=${ADMIN_TOKEN}`;
    
    try {
        const response = await fetch(apiUrl, { 
            method: 'GET',
            cache: 'no-store' // CRUCIAL: siempre obtener datos frescos
        });

        if (response.status === 401) {
            console.error(`Token de administración inválido para endpoint: ${endpoint}`);
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

// -----------------------------------------------------------------
// Componente de Pestañas
// -----------------------------------------------------------------

// Defino los tipos de pestañas disponibles
const TABS = {
    vuelos: { label: 'Vuelos', endpoint: 'leads', component: FlightLeadsTable },
    alojamiento: { label: 'Alojamiento', endpoint: 'accommodation', component: AccommodationTable },
    autos: { label: 'Alquiler de Autos', endpoint: 'carrental', component: CarRentalTable },
    itinerarios: { label: 'Diseño de Viaje (Valor)', endpoint: 'itineraries', component: ItineraryTable },
} as const; 

// SOLUCIÓN FINAL: Usamos la desestructuración de 'searchParams' en la firma
export default async function AdminLeadsPage({
    searchParams, 
}: {
    searchParams: { tab?: keyof typeof TABS };
}) {
    // Leemos el token del entorno (Solución al error de ámbito)
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN; 
    
    // Si el token no está, lanzamos 404 (seguridad)
    if (!ADMIN_TOKEN) {
        notFound(); 
    }

    // 1. Determinar la pestaña activa (Lectura directa para evitar Promesa)
    // El compilador asume que 'searchParams' es el objeto Promise, pero lo forzamos a ser string.
    const activeTabKey = (searchParams.tab || 'vuelos') as keyof typeof TABS; 
    const activeTab = TABS[activeTabKey] || TABS.vuelos;

    // 2. Obtener los leads de la pestaña activa
    const leads: any[] = await getLeads(activeTab.endpoint); 
    const TotalLeads = leads.length;

    // 3. El componente de tabla se asigna dinámicamente
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


            {/* Contenido de la Tabla */}
            <Suspense fallback={<div>Cargando leads...</div>}>
                {TotalLeads === 0 ? (
                    <div className="text-center p-10 bg-white shadow rounded-lg text-gray-600">
                        No se encontraron leads para esta categoría ({activeTab.label}).
                    </div>
                ) : (
                    // Renderizamos el componente de tabla dinámicamente
                    <LeadsComponent leads={leads as any} token={ADMIN_TOKEN} /> 
                )}
            </Suspense>
        </div>
    );
}