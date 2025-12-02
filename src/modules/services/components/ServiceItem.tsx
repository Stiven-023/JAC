'use client'
import React, { useState } from 'react';
import type { ServicioType } from '@/modules/services/types';
import ServiceModal from './ServiceModal';

type Props = {
    servicio: ServicioType;
    onApply?: (payload: { userId: string | null; serviceId: number; note?: string }) => Promise<void> | void;
};

export default function ServiceItem({ servicio, onApply }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <article className="border rounded p-4 bg-white shadow-sm">
                <h3 className="font-semibold">{servicio.title}</h3>
                <p className="text-sm text-gray-500">{servicio.shortDescription}</p>

                <div className="mt-3 flex items-center gap-2 justify-end">
                    <button onClick={() => setOpen(true)} className="px-3 py-1 rounded bg-blue-600 text-white">
                        Aplicar
                    </button>
                    <button onClick={() => {/* opcion: ver detalle */ }} className="px-3 py-1 rounded border">
                        Cancelar
                    </button>
                </div>
            </article>

            <ServiceModal servicio={servicio} open={open} onClose={() => setOpen(false)} onApply={onApply} />
        </>
    );
}