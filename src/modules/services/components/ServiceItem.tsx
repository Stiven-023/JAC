'use client'
import React, { useState } from 'react';
import type { ServicioType } from '@/modules/services/types';
import ServiceModal from './ServiceModal';
import { insertarDatos } from "@/modules/services/action";

type Props = {
    servicio: ServicioType;
    onApply?: never;
};

export default function ServiceItem({ servicio }: Props) {
    const [open, setOpen] = useState(false);

    const handleSaveData = async (payload: { userId: string | null; serviceId: number; note: string; address: string }) => {
        if (!payload.userId) return;

        const result = await insertarDatos(
            payload.userId,
            payload.serviceId,
            payload.note,
            payload.address
        );

        console.log("Datos guardados:", result);

    };

    return (
        <>
            <article className="border rounded p-4 bg-white shadow-sm flex flex-col h-full justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{servicio.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{servicio.shortDescription}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 justify-end border-t pt-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Solicitar
                    </button>
                </div>
            </article>

            <ServiceModal
                servicio={servicio}
                open={open}
                onClose={() => setOpen(false)}
                onApply={handleSaveData}
            />
        </>
    );
}