// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// 1. Declaramos la variable global para evitar crear múltiples instancias en desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}

// 2. Usamos la variable global o creamos una nueva instancia
export const prisma = global.prisma || new PrismaClient();

// 3. En modo desarrollo, asignamos la instancia a la variable global
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// ¡Este archivo es crucial para una buena práctica con Next.js!