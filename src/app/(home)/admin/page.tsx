// app/home/admin/page.tsx (Server Component)

import {
    obtenerListaResidentesAdmin,
    obtenerListaServiciosAdmin,
    obtenerListaSolicitudesAdmin,
    ResidenteAdmin,
    ServicioDisponible,
    Solicitud,
} from '@/lib/adminActions';

import AdminClientLayout from "@/components/AdminClientLayout";

import { ActionResult, getNoticias } from '@/lib/admin/noticias';
import { NoticiaConResidente } from '@/lib/supabase';

export default async function AdminPage() {
    let initialResidents: ResidenteAdmin[] = [];
    let initialError: string | null = null;
    let initialServices: ServicioDisponible[] = [];
    let serviceError: string | null = null;
    let initialRequests: Solicitud[] = [];
    let requestError: string | null = null;

    // 💡 Ajustar el tipo inicial para que refleje lo que getNoticias devuelve
    let initialNoticiasResult: ActionResult = { success: false, data: [] as NoticiaConResidente[] };

    // Cargar Residentes
    try {
        initialResidents = await obtenerListaResidentesAdmin();
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

    // Cargar Noticias
    try {
        initialNoticiasResult = await getNoticias();
    } catch (error) {
        console.error("Fallo al cargar noticias en AdminPage:", error);
        initialNoticiasResult = { success: false, data: [], error: 'Error al cargar noticias.' };
    }

    const initialNoticias: NoticiaConResidente[] =
        initialNoticiasResult.success && Array.isArray(initialNoticiasResult.data)
            ? initialNoticiasResult.data as NoticiaConResidente[]
            : [];

    return (
        <AdminClientLayout
            initialResidents={initialResidents}
            initialError={initialError}
            initialServices={initialServices}
            serviceError={serviceError}
            initialRequests={initialRequests}
            requestError={requestError}
            initialNoticias={initialNoticias}
        />
    );
}