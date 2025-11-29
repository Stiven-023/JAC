import { obtenerListaResidentesAdmin, ResidenteAdmin } from '@/lib/adminActions';
import AdminClientLayout from "@/components/AdminClientLayout";
import { ActionResult, getNoticias } from '@/lib/admin/noticias';
import { Noticia } from '@/lib/supabase';

export default async function AdminPage() {
    
    let initialResidents: ResidenteAdmin[] = [];
    let initialNoticias: ActionResult = { success: false, data: [] };
    let initialError: string | null = null;

    try {
        initialResidents = await obtenerListaResidentesAdmin();
        initialNoticias = await getNoticias();
    } catch (error) {
        console.error("Fallo al cargar residentes en AdminPage:", error);
        initialError = error instanceof Error ? error.message : "Error desconocido al cargar usuarios.";
    }

    function normalizeNoticias(data?: Noticia | Noticia[]): Noticia[] {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
    }

    return (
        <AdminClientLayout
            initialResidents={initialResidents}
            initialNoticias={normalizeNoticias(initialNoticias?.data)}
            initialError={initialError}
        />
    );
}