// app/home/admin/page.tsx (Server Component)

import { 
    obtenerListaResidentesAdmin, 
    obtenerListaServiciosAdmin, 
    obtenerListaSolicitudesAdmin, // ⬅️ Nuevo Import
    ResidenteAdmin, 
    ServicioDisponible,           // ⬅️ Nuevo Tipo
    Solicitud                     // ⬅️ Nuevo Tipo
} from '@/lib/adminActions';
import AdminClientLayout from "@/components/AdminClientLayout";
import { ActionResult, getNoticias } from '@/lib/admin/noticias';
import { Noticia } from '@/lib/supabase';

export default async function AdminPage() {
    let initialResidents: ResidenteAdmin[] = [];
    let initialError: string | null = null;
    let initialServices: ServicioDisponible[] = [];
    let serviceError: string | null = null;
    let initialRequests: Solicitud[] = [];
    let requestError: string | null = null;
    let initialNoticias: ActionResult = { success: false, data: [] };

    // Cargar Residentes
    try {
        initialResidents = await obtenerListaResidentesAdmin();
        initialNoticias = await getNoticias();
    } catch (error) {
        console.error("Fallo al cargar residentes en AdminPage:", error);
        initialError = error instanceof Error ? error.message : "Error desconocido al cargar usuarios.";
    }

    // Cargar Servicios Disponibles
    try {
        initialServices = await obtenerListaServiciosAdmin();
    } catch (error) {
        console.error("Fallo al cargar servicios disponibles en AdminPage:", error);
        serviceError = error instanceof Error ? error.message : "Error desconocido al cargar servicios.";
    }
    
    // Cargar Solicitudes
    try {
        initialRequests = await obtenerListaSolicitudesAdmin();
    } catch (error) {
        console.error("Fallo al cargar solicitudes en AdminPage:", error);
        requestError = error instanceof Error ? error.message : "Error desconocido al cargar solicitudes.";
    }

    function normalizeNoticias(data?: Noticia | Noticia[]): Noticia[] {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
    }

    return (
        <AdminClientLayout
            initialResidents={initialResidents}
            initialError={initialError}
            initialServices={initialServices}
            serviceError={serviceError}
            initialRequests={initialRequests}
            requestError={requestError}
            initialNoticias={normalizeNoticias(initialNoticias?.data)}
        />
    );
}