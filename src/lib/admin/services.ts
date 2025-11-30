'use server';

import { supabaseAdmin } from './admin-config';

// Tipos
export type ServicioDisponible = {
    id_servicio: number;
    titulo_servicio: string;
    descripcion_short: string;
    descripcion_full: string | null;
    is_activo: boolean;
};

export type CrudResult = { success: boolean, message?: string, data?: ServicioDisponible | null };


// CRUD de Servicios

export async function obtenerListaServiciosAdmin(): Promise<ServicioDisponible[]> {
    const { data: servicios, error } = await supabaseAdmin
        .from('servicios_disponibles')
        .select(`
            id_servicio,
            titulo_servicio,
            descripcion_short,
            descripcion_full,
            is_activo
        `)
        .order('id_servicio', { ascending: false });

    if (error) {
        console.error('Error al obtener la lista de servicios disponibles:', error.message);
        throw new Error('No se pudo cargar la lista de servicios disponibles. Error de BD.');
    }

    return servicios as ServicioDisponible[];
}

export async function crearServicioDisponible(formData: FormData): Promise<CrudResult> {
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const is_activo = formData.get('is_activo') === 'true';

    if (!titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios (Título y descripción corta).' };
    }

    try {
        const { data: newService, error } = await supabaseAdmin
            .from('servicios_disponibles')
            .insert({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                is_activo,
            })
            .select(`id_servicio, titulo_servicio, descripcion_short, descripcion_full, is_activo`)
            .single();

        if (error) {
            console.error('Error al crear servicio:', error.message);
            if (error.code === '23505') {
                return { success: false, message: `El servicio "${titulo_servicio}" ya existe.` };
            }
            return { success: false, message: 'Fallo al registrar el nuevo servicio.' };
        }

        return {
            success: true,
            message: 'Servicio creado exitosamente.',
            data: newService
        };

    } catch (e) {
        console.error("Error crítico al crear servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function actualizarServicioDisponible(formData: FormData): Promise<CrudResult> {
    const id_servicio = formData.get('id_servicio') as string;
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const is_activo = formData.get('is_activo') === 'true';

    if (!id_servicio || !titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios o ID del servicio.' };
    }

    try {
        const { data: updatedService, error } = await supabaseAdmin
            .from('servicios_disponibles')
            .update({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                is_activo,
            })
            .eq('id_servicio', parseInt(id_servicio))
            .select(`id_servicio, titulo_servicio, descripcion_short, descripcion_full, is_activo`)
            .single();

        if (error) {
            console.error('Error al actualizar servicio:', error.message);
            if (error.code === '23505') {
                return { success: false, message: `El servicio "${titulo_servicio}" ya existe con otro registro.` };
            }
            return { success: false, message: 'Fallo al actualizar el servicio.' };
        }

        return {
            success: true,
            message: 'Servicio actualizado exitosamente.',
            data: updatedService
        };

    } catch (e) {
        console.error("Error crítico al actualizar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function eliminarServicioDisponible(id_servicio: number): Promise<CrudResult> {
    if (!id_servicio) {
        return { success: false, message: 'ID del servicio es obligatorio para eliminar.' };
    }

    try {

        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .delete()
            .eq('id_servicio', id_servicio);

        if (error) {
            console.error('Error al eliminar servicio:', error.message);
            if (error.code === '23503') {
                return { success: false, message: 'No se puede eliminar: Este servicio tiene solicitudes asociadas activas.' };
            }
            return { success: false, message: 'Fallo al eliminar el servicio.' };
        }

        return { success: true, message: 'Servicio eliminado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al eliminar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}