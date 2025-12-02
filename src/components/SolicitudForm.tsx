// "use client";

// import { useState } from "react";
// import { crearNuevaSolicitud } from "@/src/app/admin/requests";

// export default function SolicitudForm({ idServicio }: { idServicio: string }) {
//     const [msg, setMsg] = useState("");

//     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//         e.preventDefault();

//         const formData = new FormData(e.currentTarget);
//         formData.append("servicioId", idServicio);

//         const res = await crearNuevaSolicitud(formData);

//         setMsg(res.message);

//         if (res.ok) {
//             e.currentTarget.reset();
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <h2 className="text-xl font-bold">Crear Solicitud</h2>

//             <input
//                 name="nombre"
//                 placeholder="Tu nombre"
//                 required
//                 className="border p-2 w-full rounded"
//             />

//             <textarea
//                 name="descripcion"
//                 placeholder="Descripción"
//                 required
//                 className="border p-2 w-full rounded"
//             />

//             <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                 Enviar
//             </button>

//             {msg && <p className="text-green-600">{msg}</p>}
//         </form>
//     );
// }
