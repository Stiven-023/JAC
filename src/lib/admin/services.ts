// src/lib/admin/services.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './admin-config';

// Tipos
export type ServicioDisponible = {
    id_servicio: number;
    titulo_servicio: string;
    descripcion_short: string;
    descripcion_full: string | null;
    icono_nombre: string | null;
    is_activo: boolean;
};

// --- CRUD de Servicios Disponibles ---

export async function obtenerListaServiciosAdmin(): Promise<ServicioDisponible[]> {
    const { data: servicios, error } = await supabaseAdmin
        .from('servicios_disponibles')
        .select(`
            id_servicio,
            titulo_servicio,
            descripcion_short,
            descripcion_full,
            icono_nombre,
            is_activo
        `)
        .order('titulo_servicio', { ascending: true });

    if (error) {
        console.error('Error al obtener la lista de servicios disponibles:', error.message);
        throw new Error('No se pudo cargar la lista de servicios disponibles. Error de BD.');
    }

    return servicios as ServicioDisponible[];
}

export async function crearServicioDisponible(formData: FormData) {
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const icono_nombre = formData.get('icono_nombre') as string | null;
    const is_activo = formData.get('is_activo') === 'true'; 

    if (!titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios (Título y descripción corta).' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .insert({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                icono_nombre: icono_nombre || null,
                is_activo,
            });

        if (error) {
            console.error('Error al crear servicio:', error.message);
            if (error.code === '23505') { 
                 return { success: false, message: `El servicio "${titulo_servicio}" ya existe.` };
            }
            return { success: false, message: 'Fallo al registrar el nuevo servicio.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Servicio creado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al crear servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function actualizarServicioDisponible(formData: FormData) {
    const id_servicio = formData.get('id_servicio') as string;
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const icono_nombre = formData.get('icono_nombre') as string | null;
    const is_activo = formData.get('is_activo') === 'true'; 

    if (!id_servicio || !titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios o ID del servicio.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .update({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                icono_nombre: icono_nombre || null,
                is_activo,
            })
            .eq('id_servicio', parseInt(id_servicio));

        if (error) {
            console.error('Error al actualizar servicio:', error.message);
             if (error.code === '23505') { 
                 return { success: false, message: `El servicio "${titulo_servicio}" ya existe con otro registro.` };
            }
            return { success: false, message: 'Fallo al actualizar el servicio.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Servicio actualizado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al actualizar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function eliminarServicioDisponible(id_servicio: number) {
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

        revalidatePath('/home/admin');
        return { success: true, message: 'Servicio eliminado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al eliminar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}