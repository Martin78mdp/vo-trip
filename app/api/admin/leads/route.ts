// app/api/admin/leads/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// La función debe exportarse de forma NOMBRADA (export async function GET)
export async function GET(request: Request) { 
  try {
    // 1. Obtener el token de seguridad
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // 2. Implementar Validación de Seguridad
    if (token !== process.env.ADMIN_TOKEN || !process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Acceso Denegado. Token Invalido.' }, { status: 401 });
    }
    
    // 3. Obtener TODOS los leads
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        origin: true,
        destination: true,
        departureDate: true,
        returnDate: true,
        passengers: true,
        name: true,
        email: true,
        phone: true,
      }
    });

    // 4. Devolver la lista de leads
    return NextResponse.json(leads, { status: 200 });
    
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json({ error: 'Error interno del servidor al obtener la lista de leads.' }, { status: 500 });
  }
}

// ⚠️ Asegúrate de NO tener un 'export default' en este archivo.