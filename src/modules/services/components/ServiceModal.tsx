'use client'
import React from 'react';
import ServiceForm from './ServiceForm';
import type { ServicioType } from '@/modules/services/types';

type Props = {
    servicio: ServicioType;
    open: boolean;
    onClose: () => void;
    onApply?: (payload: {
        userId: string | null;
        serviceId: number;
        note: string;
        address: string;
    }) => Promise<void> | void;
};

export default function ServiceModal({ servicio, open, onClose, onApply }: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Solicitar servicio</h2>
                    <button aria-label="Cerrar" onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100">✕</button>
                </div>

                <div className="p-4">
                    <ServiceForm
                        servicio={servicio}
                        onApply={async (payload) => {
                            await onApply?.(payload);
                            onClose();
                        }}
                        onCancel={onClose}
                        showUserIdField={false}
                    />
                </div>
            </div>
        </div>
    );
}