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
import { ActionResultEvento, Evento, Inscripcion, getEventos, obtenerInscripcionesAdmin } from '@/lib/admin/eventos'; 

export default async function AdminPage() {


    let initialResidents: ResidenteAdmin[] = [];
    let initialError: string | null = null; 
    let initialServices: ServicioDisponible[] = [];
    let serviceError: string | null = null;
    let initialRequests: Solicitud[] = [];
    let requestError: string | null = null;

    let initialNoticiasResult: ActionResult = { success: false, data: [] as NoticiaConResidente[] };
    let initialEventosResult: ActionResultEvento = { success: false, data: [] as Evento[] };
    let initialInscripciones: Inscripcion[] = []; 
    

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

    try {
        const [eventosRes, inscripcionesRes] = await Promise.all([
            getEventos(),
            obtenerInscripcionesAdmin()
        ]);
        
        initialEventosResult = eventosRes;
        initialInscripciones = inscripcionesRes;

    } catch (error) {
        console.error("Fallo al cargar eventos en AdminPage:", error);
    }

    const initialNoticias: NoticiaConResidente[] =
        initialNoticiasResult.success && Array.isArray(initialNoticiasResult.data)
            ? initialNoticiasResult.data as NoticiaConResidente[]
            : [];
    
    const initialEventos: Evento[] =
        initialEventosResult.success && Array.isArray(initialEventosResult.data)
            ? initialEventosResult.data as Evento[]
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
            initialEventos={initialEventos}
            initialInscripciones={initialInscripciones} 
        />
    );
}