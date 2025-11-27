import { obtenerListaResidentesAdmin, ResidenteAdmin } from '@/lib/adminActions';
import { UserManagement } from "@/components/UserManagement";

export default async function PageUserManagement() {

    let residentes: ResidenteAdmin[] = [];
    let errorCarga: string | null = null;

    try {
        residentes = await obtenerListaResidentesAdmin();
    } catch (error) {
        console.error("Fallo al cargar residentes:", error);
        errorCarga = error instanceof Error ? error.message : "Error desconocido al cargar usuarios.";
    }

    return (
        <>
            <UserManagement
                initialResidents={residentes}
                initialError={errorCarga}
            />
        </>
    )
}