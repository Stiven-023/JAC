import { supabase } from "@/lib/supabase";
import SolicitudForm from "./solicitud-form";

export default async function ServicioDetalle({ params }: { params: { id: string } }) {

    const { data, error } = await supabase
        .from("servicios_disponibles")
        .select("*")
        .eq("id_servicio", params.id)
        .single();

    if (error || !data) {
        return <p>Error al cargar el servicio.</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold">{data.titulo_servicio}</h1>

            <p className="mt-2 text-gray-700">{data.descripcion_full}</p>

            <div className="mt-8 border-t pt-6">
                <SolicitudForm idServicio={data.id_servicio} />
            </div>
        </div>
    );
}
