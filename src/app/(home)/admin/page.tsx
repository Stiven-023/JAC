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

export default async function AdminPage() {
    
    // --- 1. Inicialización de Variables ---
    
    // Residentes (Datos originales)
    let initialResidents: ResidenteAdmin[] = [];
    let initialError: string | null = null; // Error de Residentes
    
    // Servicios Disponibles (Nuevos)
    let initialServices: ServicioDisponible[] = [];
    let serviceError: string | null = null;
    
    // Solicitudes (Nuevos)
    let initialRequests: Solicitud[] = [];
    let requestError: string | null = null;

    // --- 2. Carga de Datos (Server Actions) ---

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


    // --- 3. Renderizar y Pasar Props ---

    return (
        <AdminClientLayout
            // Props de Residentes
            initialResidents={initialResidents}
            initialError={initialError} // Error de Residentes (respeta el nombre original)
            
            // Props de Servicios
            initialServices={initialServices}
            serviceError={serviceError}
            
            // Props de Solicitudes
            initialRequests={initialRequests}
            requestError={requestError}
        />
    );
}