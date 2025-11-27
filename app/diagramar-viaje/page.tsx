// app/diagramar-viaje/page.tsx

import ItineraryForm from '@/components/forms/ItineraryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diseño de Viaje a Medida | Argentina',
  description: 'Solicita un itinerario y presupuesto personalizado para viajar por Argentina.',
};

export default function DiagramarViajePage() {
  return (
    <div className="container mx-auto p-4">
        <ItineraryForm />
    </div>
  );
}