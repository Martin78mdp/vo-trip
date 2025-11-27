// app/api/carrental/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Reutilizamos el cliente Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestructurar los campos que definimos en el schema.prisma
    const { 
        pickupLocation, 
        returnLocation, 
        pickupDate, 
        returnDate, 
        carType, 
        ageOfDriver, 
        name, 
        email, 
        phone 
    } = body;

    // Validación básica: asegura que los campos más importantes existan
    if (!pickupLocation || !returnLocation || !pickupDate || !returnDate || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para la solicitud de alquiler de auto.' }, { status: 400 });
    }

    // 1. Manejo Defensivo de Fechas y Números
    const convertedPickupDate = new Date(pickupDate);
    const convertedReturnDate = new Date(returnDate);
    const driverAge = ageOfDriver ? parseInt(ageOfDriver, 10) : null; 

    // Validación de fechas
    if (isNaN(convertedPickupDate.getTime()) || isNaN(convertedReturnDate.getTime())) {
         return NextResponse.json({ error: 'Formato de fecha de recogida o devolución inválido.' }, { status: 400 });
    }
    
    // 2. Guardar el nuevo lead en la tabla CarRentalLead
    const newCarRentalLead = await prisma.carRentalLead.create({
      data: {
        pickupLocation,
        returnLocation,
        
        // Usamos los valores convertidos
        pickupDate: convertedPickupDate,
        returnDate: convertedReturnDate,
        
        carType: carType || 'No especificado',
        ageOfDriver: driverAge, // Será un número o null
        
        name,
        email,
        phone,
        status: 'PENDIENTE', // Utiliza el ENUM Status
      },
    });

    return NextResponse.json({ message: 'Solicitud de alquiler de auto guardada con éxito.', lead: newCarRentalLead }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar el lead de alquiler de auto:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}