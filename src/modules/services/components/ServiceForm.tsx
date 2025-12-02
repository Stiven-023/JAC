'use client'
import React, { useEffect, useState } from "react";
import type { ServicioType } from "@/modules/services/types";

type Props = {
    servicio: ServicioType;
    onApply?: (payload: { userId: string | null; serviceId: number; note: string; address: string }) => Promise<void> | void;
    onCancel?: () => void;
    showUserIdField?: boolean;
};

export default function ServiceForm({
    servicio,
    onApply,
    onCancel,
    showUserIdField = false,
}: Props) {
    const [userId, setUserId] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try { setUserId(localStorage.getItem('user_id')); } catch { /* silent */ }
    }, []);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!userId) throw new Error('No se encontró user_id. Inicia sesión o proporciona un id.');
            if (!address.trim()) throw new Error('La dirección es obligatoria.');

            await onApply?.({ userId, serviceId: servicio.id, note, address });
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleApply} className="w-full max-w-xl bg-white p-4 rounded shadow">
            <header className="mb-3">
                <h3 className="text-lg font-semibold">{servicio.title}</h3>
                <p className="text-sm text-gray-500">{servicio.shortDescription}</p>
            </header>

            {/* ... Campos existentes ... */}

            {showUserIdField && (
                <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">User ID</label>
                    <input
                        value={userId ?? ''}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            )}

            {/* NUEVO CAMPO: Dirección */}
            <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Dirección *</label>
                <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ej: Calle 123 # 45-67"
                />
            </div>

            <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Nota (opcional)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    placeholder="Detalles adicionales..."
                />
            </div>

            {error && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-3 py-1 rounded border bg-white hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                    {loading ? 'Enviando...' : 'Confirmar Solicitud'}
                </button>
            </div>
        </form>
    );
}