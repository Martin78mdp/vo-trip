// app/api/itineraries/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Reutilizamos el cliente Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestructurar los campos del modelo ItineraryLead
    const { 
        departureCity, 
        desiredDestinations, 
        budgetPerPerson, 
        durationDays, 
        travelType, 
        notes, 
        name, 
        email, 
        phone 
    } = body;

    // Validación básica: asegura que los campos más importantes existan
    if (!desiredDestinations || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (Destinos, Nombre, Email).' }, { status: 400 });
    }

    // 1. Manejo Defensivo de Números y Campos Opcionales
    // Convertimos la duración a un número o a null si está vacío/no es válido
    const parsedDuration = durationDays ? parseInt(durationDays, 10) : null;
    
    // 2. Guardar el nuevo lead en la tabla ItineraryLead
    const newItineraryLead = await prisma.itineraryLead.create({
      data: {
        desiredDestinations,
        name,
        email,
        phone,
        
        // Campos Opcionales
        departureCity: departureCity || 'No especificado',
        budgetPerPerson: budgetPerPerson || 'No especificado',
        durationDays: parsedDuration, // Número o null
        travelType: travelType || 'No especificado',
        notes: notes || 'Sin notas adicionales',
        
        status: 'PENDIENTE', // Utiliza el ENUM Status
      },
    });

    return NextResponse.json({ message: 'Solicitud de diagrama de viaje guardada con éxito.', lead: newItineraryLead }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar el lead de itinerario:', error);
    // Si persiste el error de PrismaClientKnownRequestError, es útil devolverlo
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}