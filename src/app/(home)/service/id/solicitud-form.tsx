'use client';

import { useState } from "react";
import { crearNuevaSolicitud } from "@/lib/admin/requests";

export default function SolicitudForm({ idServicio }: { idServicio: number }) {

    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Simulas obtener el usuario autenticado
    // En tu app real lo cambiarás por tu session.user.id
    const residentId = "USER123"; // <-- cámbialo según tu auth

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("id_servicio", idServicio.toString());
        formData.append("descripcion", descripcion);
        formData.append("direccion", direccion);

        const res = await crearNuevaSolicitud(formData, residentId);

        setLoading(false);
        setMessage(res.message);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 rounded bg-gray-50 shadow"
        >
            <h3 className="text-xl font-semibold mb-4">Crear Solicitud</h3>

            <input type="hidden" name="id_servicio" value={idServicio} />

            <div className="mb-4">
                <label className="block text-sm mb-1">Descripción</label>
                <textarea
                    className="w-full border p-2 rounded"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm mb-1">Dirección</label>
                <input
                    className="w-full border p-2 rounded"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                />
            </div>

            <button
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>

            {message && (
                <p className="mt-4 text-sm text-green-600">{message}</p>
            )}
        </form>
    );
}
