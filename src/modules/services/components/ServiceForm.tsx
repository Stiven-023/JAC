'use client'
import React, { useEffect, useState } from "react";
import type { ServicioType } from "@/modules/services/types";

type Props = {
    servicio: ServicioType;
    onApply?: (payload: { userId: string | null; serviceId: number; note?: string }) => Promise<void> | void;
    onCancel?: () => void;
    showUserIdField?: boolean; // si true permite editar el user id
};

export default function ServiceForm({
    servicio,
    onApply,
    onCancel,
    showUserIdField = false,
}: Props) {
    const [userId, setUserId] = useState<string | null>(null);
    const [note, setNote] = useState('');
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
            if (!userId) {
                setError('No se encontró user_id. Inicia sesión o proporciona un id.');
                setLoading(false);
                return;
            }
            await onApply?.({ userId, serviceId: servicio.id, note });
        } catch (err) {
            setError(String(err ?? 'Error'));
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

            <div className="mb-3 text-sm text-gray-700">
                {servicio.fullDescription || <span className="text-gray-400">Sin descripción adicional.</span>}
            </div>

            {showUserIdField && (
                <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">User id</label>
                    <input
                        value={userId ?? ''}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="user id"
                    />
                </div>
            )}

            <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Nota (opcional)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    placeholder="Escribe una nota o comentario para la solicitud..."
                />
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-3 py-1 rounded border bg-white">Cancelar</button>
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-60">
                    {loading ? 'Aplicando...' : 'Aplicar'}
                </button>
            </div>
        </form>
    );
}
// Necesitas crear un componente que muestre los datos del servicio (tipo ya creado) -> botones de aplicar y cancelar
// Necesitas un dialog para mostrar este componente (poder cerrar y el diago o cancelar)
// action -> para hacer el insert en la tabla 'solicitud de servicio' (verificar nombre) -> id usuario, y los demas datos del servicio incluido el id