// app/api/leads/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Importamos el cliente Prisma que creamos

// 1. Manejamos la solicitud POST (cuando el usuario envía el formulario)
export async function POST(request: Request) {
  try {
    // 2. Parseamos el cuerpo JSON de la solicitud
    const body = await request.json();
    
    // 3. Extraemos y validamos los datos esenciales del formulario
    const { 
        origin, 
        destination, 
        departureDate, 
        returnDate, 
        passengers, 
        name, 
        email, 
        phone 
    } = body;

    // VALIDACIÓN BÁSICA: Aseguramos que los campos requeridos estén presentes
    if (!origin || !destination || !departureDate || !name || !email || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    // 4. USAMOS PRISMA para crear un nuevo registro en la tabla 'Lead'
    const newLead = await prisma.lead.create({
      data: {
        origin,
        destination,
        // Convertimos las fechas de string a objetos Date para PostgreSQL
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : undefined, // Si es opcional
        passengers: parseInt(passengers, 10), // Convertimos a número
        name,
        email,
        phone,
        status: 'PENDIENTE', // Establecemos el estado inicial
      },
    });

    // 5. Devolvemos una respuesta exitosa al formulario
    return NextResponse.json({ message: 'Lead guardado con éxito', lead: newLead }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar el lead:', error);
    // 6. Devolvemos un error si falla la conexión a DB o la lógica
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}