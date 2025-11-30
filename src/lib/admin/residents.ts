'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './admin-config';


export type ResidenteAdmin = {
    id_residentes: string;
    full_name: string;
    document_number: string;
    contact_info: string;
    apartment_number: string;
    is_admin: boolean;
    estado: boolean;
};

export interface ActionResult {
    success: boolean;
    message: string;
    data?: ResidenteAdmin;
}


export async function obtenerListaResidentesAdmin(): Promise<ResidenteAdmin[]> {
    const { data: residentes, error } = await supabaseAdmin
        .from('residents')
        .select(`
            id_residentes, 
            full_name, 
            document_number, 
            contact_info,
            apartment_number, 
            is_admin,
            estado
        `)
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error al obtener la lista de residentes para el Admin:', error.message);
        throw new Error('No se pudo cargar la lista de usuarios. Error de BD.');
    }

    return residentes as ResidenteAdmin[];
}

export async function actualizarResidenteAdmin(formData: FormData): Promise<ActionResult> {
    const id_residentes = formData.get('id_residentes');
    const is_admin_nuevo = formData.get('is_admin') === 'true';
    const full_name_nuevo = formData.get('full_name');
    const estado_nuevo = formData.get('estado') === 'true';
    const contact_info_nuevo = formData.get('contact_info');

    if (!id_residentes || typeof id_residentes !== 'string' || id_residentes === 'null') {
         return { success: false, message: 'ID de residente inválido o faltante.' };
    }

    if (!full_name_nuevo || typeof full_name_nuevo !== 'string' || !contact_info_nuevo || typeof contact_info_nuevo !== 'string') {
        return { success: false, message: 'Nombre o Correo Electrónico son obligatorios.' };
    }


    const { error, data } = await supabaseAdmin 
        .from('residents')
        .update({
            full_name: full_name_nuevo,
            contact_info: contact_info_nuevo,
            is_admin: is_admin_nuevo,
            estado: estado_nuevo
        })
        .eq('id_residentes', id_residentes)
        .select()
        .single(); 

    if (error) {
        console.error('Error al actualizar residente:', error.message);
        return { success: false, message: `Fallo al actualizar el perfil: ${error.message}` };
    }

    revalidatePath('/home/admin');
    return { 
        success: true, 
        message: 'Residente actualizado exitosamente.',
        data: data as ResidenteAdmin
    };
}

export async function eliminarResidenteAdmin(id_residentes: string): Promise<{ success: boolean; message: string }> { // Tipado simple para esta acción
    try {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id_residentes);

        if (authError && authError.message !== 'User not found') {
            return { success: false, message: 'Fallo al eliminar el usuario de autenticación.' };
        }
        
        const { error: dbError } = await supabaseAdmin
            .from('residents')
            .delete()
            .eq('id_residentes', id_residentes);

        if (dbError) {
            console.error('ERROR CRÍTICO: Fallo al eliminar el perfil de la BD. ID:', id_residentes);
            return { success: false, message: 'Error de consistencia en la BD. Perfil restante.' };
        }
        
        revalidatePath('/home/admin');
        return { success: true, message: 'Usuario eliminado completamente.' };

    } catch (e) {
        console.error("ERROR CRÍTICO INESPERADO en eliminarResidenteAdmin:", e);
        return { success: false, message: 'Error interno en el servidor. Intente de nuevo.' };
    }
}