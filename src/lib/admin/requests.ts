'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './admin-config';
import { ResidenteAdmin } from './residents';
import { ServicioDisponible } from './services';
import { CrudResult } from './types';


/*export type CrudResult<T = unknown> = { success: boolean, message?: string, data?: T | null };*/

// Tipos
export type Solicitud = {
    id_solicitud: number;
    resident_id: string;
    id_servicio: number;
    descripcion: string;
    direccion: string;
    estado: 'en_tramite' | 'atendida' | 'cerrada';
    fecha_creacion: string;
    fecha_actualizacion: string | null;
    titulo_servicio: string;
    resident_name: string;
};

// Tipo interno para la DB con relaciones
type SolicitudDB = Omit<Solicitud, 'titulo_servicio' | 'resident_name'> & {
    servicios_disponibles: Pick<ServicioDisponible, 'titulo_servicio'>;
    residents: Pick<ResidenteAdmin, 'full_name'>;
};

export async function obtenerListaSolicitudesAdmin(): Promise<Solicitud[]> {
    const { data: solicitudes, error } = await supabaseAdmin
        .from('solicitudes')
        .select(`
            id_solicitud,
            resident_id,
            id_servicio,
            descripcion,
            direccion,
            estado,
            fecha_creacion,
            fecha_actualizacion,
            servicios_disponibles ( titulo_servicio ),
            residents ( full_name ) 
        `)
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error('Error al obtener la lista de solicitudes:', error.message);
        throw new Error('No se pudo cargar la lista de solicitudes. Error de BD.');
    }

    return (solicitudes as unknown as SolicitudDB[]).map((row) => {
        const { servicios_disponibles, residents, ...rest } = row;
        return {
            ...rest,
            titulo_servicio: servicios_disponibles?.titulo_servicio || 'Servicio eliminado',
            resident_name: residents?.full_name || 'Usuario desconocido',
        };
    }); 
}

export async function actualizarEstadoSolicitud(id_solicitud: number, nuevoEstado: Solicitud['estado']): Promise<CrudResult<Solicitud>> {
    if (!id_solicitud || !nuevoEstado) {
        return { success: false, message: 'ID y nuevo estado son obligatorios.' };
    }

    try {
        const { data: updatedData, error } = await supabaseAdmin
            .from('solicitudes')
            .update({
                estado: nuevoEstado,
                fecha_actualizacion: new Date().toISOString()
            })
            .eq('id_solicitud', id_solicitud)
            .select(`
                id_solicitud,
                resident_id,
                id_servicio,
                descripcion,
                direccion,
                estado,
                fecha_creacion,
                fecha_actualizacion,
                servicios_disponibles ( titulo_servicio ),
                residents ( full_name ) 
            `)
            .single();

        if (error) {
            console.error('Error al actualizar estado:', error.message);
            return { success: false, message: 'Fallo al actualizar el estado.' };
        }

        if (!updatedData) {
            return { success: false, message: 'No se encontró la solicitud.' };
        }
        
        const rawData = updatedData as unknown as SolicitudDB;

        const { servicios_disponibles, residents, ...rest } = rawData;

        const requestFormatted: Solicitud = {
            ...rest,
            titulo_servicio: servicios_disponibles?.titulo_servicio || 'Servicio eliminado',
            resident_name: residents?.full_name || 'Usuario desconocido',
        };
        return {
            success: true,
            message: 'Estado actualizado correctamente.',
            data: requestFormatted
        };

    } catch (e) {
        console.error("Error crítico al actualizar estado:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function crearNuevaSolicitud(formData: FormData, residentId: string): Promise<CrudResult> {
    const id_servicio = formData.get('id_servicio') as string;
    const descripcion = formData.get('descripcion') as string;
    const direccion = formData.get('direccion') as string;
    
    if (!id_servicio || !descripcion || !direccion || !residentId) {
        return { success: false, message: 'Faltan datos obligatorios para crear la solicitud.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('solicitudes')
            .insert({
                resident_id: residentId,
                id_servicio: parseInt(id_servicio),
                descripcion,
                direccion,
                estado: 'en_tramite'
            });

        if (error) {
            console.error('Error crear solicitud:', error.message);
            return { success: false, message: 'Fallo al registrar la solicitud.' };
        }
        
        revalidatePath('/home/admin');
        return { success: true, message: 'Solicitud enviada con éxito.' };

    } catch (e) {
        console.error("Error crítico al crear solicitud:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}