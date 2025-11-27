'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// conexion con DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables de entorno de Supabase incompletas.');
}

// Permisos de Admin
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);


export type ResidenteAdmin = {
    id: string;
    full_name: string;
    document_number: string;
    contact_info: string;
    apartment_number: string;
    is_admin: boolean;
    estado: boolean;
};


export async function obtenerListaResidentesAdmin(): Promise<ResidenteAdmin[]> {
    const { data: residentes, error } = await supabaseAdmin
        .from('residents')
        .select(`
            id, 
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

export async function actualizarResidenteAdmin(formData: FormData) {
    const id_residente = formData.get('id_residente') as string;
    const is_admin_nuevo = formData.get('is_admin') === 'true';
    const full_name_nuevo = formData.get('full_name') as string;
    const estado_nuevo = formData.get('estado') === 'true';

    const { error } = await supabaseAdmin
        .from('residents')
        .update({
            full_name: full_name_nuevo,
            is_admin: is_admin_nuevo,
            estado: estado_nuevo
        })
        .eq('id', id_residente);

    if (error) {
        console.error('Error al actualizar residente:', error.message);
        return { success: false, message: 'Fallo al actualizar el perfil.' };
    }

    // Actualiza la caché de la página de gestión de usuarios
    revalidatePath('/admin/usersManagement');
    
    return { success: true, message: 'Residente actualizado exitosamente.' };
}

export async function eliminarResidenteAdmin(id_residente: string) {

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id_residente);

    if (authError) {
        console.error('Error al eliminar usuario de Auth:', authError.message);
        return { success: false, message: 'Fallo al eliminar el usuario de autenticación.' };
    }

    
    const { error: dbError } = await supabaseAdmin
        .from('residents')
        .delete()
        .eq('id', id_residente);

    if (dbError) {
        console.error('ERROR CRÍTICO: Fallo al eliminar el perfil de la BD. ID:', id_residente);
        return { success: false, message: 'Error de consistencia en la BD. Perfil restante.' };
    }

    revalidatePath('/admin/usersManagement');

    return { success: true, message: 'Usuario eliminado completamente.' };
}