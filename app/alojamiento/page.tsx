// app/alojamiento/page.tsx

import AccomodationsForm from '@/components/forms/AccomodationsForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizar Alojamiento | [Tu Agencia]',
  description: 'Solicita cotizaciones de hoteles, departamentos y casas en Argentina y el mundo.',
};

export default function AlojamientoPage() {
  return (
    <div className="container mx-auto p-4">
        <AccomodationsForm />
    </div>
  );
}