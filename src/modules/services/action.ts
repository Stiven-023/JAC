'use server';

import { supabase } from "@/lib/supabase";
import { ServicioType, ResponseServicios } from "./types";
import { Try } from "@mui/icons-material";

const ITEMS_PER_PAGE = 2;
export async function insertarDatos(residenId: string, idServicio: number, descripcion: string, direccion: string) {

    try {
        const { data, error } = await supabase
            .from('solicitudes')
            .insert({
                resident_id: residenId,
                id_servicio: idServicio,
                descripcion: descripcion,
                direccion: direccion

            })
        if (error) throw new Error("Error al cargar servicios.");
        return data

    } catch (e) {
        console.error("Error:", e);
        return { data: [] };

    }


}

export async function obtenerServicios(page: number = 1): Promise<ResponseServicios> {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
        const { data: servicios, count, error } = await supabase
            .from("servicios_disponibles")
            .select(`
                id_servicio,
                titulo_servicio,
                descripcion_short,
                descripcion_full,
                is_activo
            `, { count: "exact" })
            .range(from, to)
            .order("id_servicio", { ascending: true });

        if (error) throw new Error("Error al cargar servicios.");

        const serviciosMap: ServicioType[] = servicios.map((srv) => ({
            id: srv.id_servicio,
            title: srv.titulo_servicio,
            shortDescription: srv.descripcion_short,
            fullDescription: srv.descripcion_full,
            isActive: srv.is_activo
        }));

        const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

        return {
            data: serviciosMap,
            totalPages
        };

    } catch (e) {
        console.error("Error:", e);
        return { data: [], totalPages: 0 };
    }
}
