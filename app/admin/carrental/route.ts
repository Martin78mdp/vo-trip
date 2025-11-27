// app/api/admin/accommodation/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // 🎯 1. IMPLEMENTACIÓN DE SEGURIDAD (Igual para todos)
    if (token !== process.env.ADMIN_TOKEN || !process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Acceso Denegado. Token Inválido.' }, { status: 401 });
    }

    // 🎯 2. CONSULTA A PRISMA (Específica para Alojamiento)
    const leads = await prisma.carRentalLead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Error al obtener leads de alojamiento:', error);
    return NextResponse.json({ error: 'Error interno del servidor al obtener leads de alojamiento.' }, { status: 500 });
  }
}