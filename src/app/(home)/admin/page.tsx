import { obtenerListaResidentesAdmin, ResidenteAdmin } from '@/lib/adminActions';
import AdminClientLayout from "@/components/AdminClientLayout";

export default async function AdminPage() {
    
    let initialResidents: ResidenteAdmin[] = [];
    let initialError: string | null = null;

    try {
        initialResidents = await obtenerListaResidentesAdmin();
    } catch (error) {
        console.error("Fallo al cargar residentes en AdminPage:", error);
        initialError = error instanceof Error ? error.message : "Error desconocido al cargar usuarios.";
    }

    return (
        <AdminClientLayout
            initialResidents={initialResidents}
            initialError={initialError}
        />
    );
}