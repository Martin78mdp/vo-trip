// app/cotizar/page.tsx

import QuotationForm from '@/components/forms/QuotationForm';
import { Metadata } from 'next';

// 1. Metadata específica para la página de cotización
export const metadata: Metadata = {
  title: 'Cotizar Vuelo Rápido | [Tu Agencia]',
  description: 'Envía tus datos de viaje y recibe la mejor cotización de pasajes aéreos.',
};

export default function CotizarPage() {
  return (
    <div className="container mx-auto p-4">
        {/* 2. Mostramos el formulario */}
        <QuotationForm /> 
    </div>
  );
}