// app/api/accommodation/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Reutilizamos el cliente Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestructurar los campos que definimos en el schema.prisma
    const { 
        destination, 
        checkInDate, 
        checkOutDate, 
        guests, 
        rooms, 
        typeOfAccommodation, // Ejemplo: "Hotel", "Departamento"
        name, 
        email, 
        phone 
    } = body;

    // Validación básica: asegura que los campos más importantes existan
    if (!destination || !checkInDate || !checkOutDate || !guests || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para la solicitud de alojamiento.' }, { status: 400 });
    }

    // Guardar el nuevo lead en la tabla AccommodationLead
    const newAccommodationLead = await prisma.accommodationLead.create({
      data: {
        destination,
        // Convertimos las fechas y números al formato correcto para la DB
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guests: parseInt(guests, 10),
        rooms: rooms ? parseInt(rooms, 10) : null, // Es opcional, usa null si no se envió
        typeOfAccommodation: typeOfAccommodation || 'No especificado', // Establece un valor por defecto si no se envió
        name,
        email,
        phone,
        status: 'PENDIENTE', // Utiliza el ENUM Status que acabamos de crear
      },
    });

    return NextResponse.json({ message: 'Solicitud de alojamiento guardada con éxito.', lead: newAccommodationLead }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar el lead de alojamiento:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}