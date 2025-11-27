// app/alquiler-autos/page.tsx

import CarRentalForm from '@/components/forms/CarRentalForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizar Alquiler de Auto | [Tu Agencia]',
  description: 'Solicita cotizaciones de autos en Argentina y el mundo.',
};

export default function AlquilerAutosPage() {
  return (
    <div className="container mx-auto p-4">
        <CarRentalForm />
    </div>
  );
}