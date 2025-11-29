'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './admin-config';
import { ResidenteAdmin } from './residents'; 
import { ServicioDisponible } from './services'; 

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

    return (solicitudes as SolicitudDB[]).map((solicitud) => ({
        ...solicitud,
        titulo_servicio: solicitud.servicios_disponibles.titulo_servicio,
        resident_name: solicitud.residents.full_name,
    })) as Solicitud[];
}

export async function actualizarEstadoSolicitud(id_solicitud: number, nuevoEstado: Solicitud['estado']) {
    if (!id_solicitud || !nuevoEstado) {
        return { success: false, message: 'ID y nuevo estado son obligatorios.' };
    }
    
    try {
        const { error } = await supabaseAdmin
            .from('solicitudes')
            .update({ 
                estado: nuevoEstado, 
                fecha_actualizacion: new Date().toISOString()
            })
            .eq('id_solicitud', id_solicitud);

        if (error) {
            console.error('Error al actualizar estado de solicitud:', error.message);
            return { success: false, message: 'Fallo al actualizar el estado.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Estado de solicitud actualizado.' };

    } catch (e) {
        console.error("Error crítico al actualizar estado:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

export async function crearNuevaSolicitud(formData: FormData, residentId: string) {
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
            console.error('Error al crear nueva solicitud:', error.message);
            return { success: false, message: 'Fallo al registrar la solicitud. Intente de nuevo.' };
        }
        
        return { success: true, message: 'Solicitud enviada con éxito. Será atendida pronto.' };

    } catch (e) {
        console.error("Error crítico al crear solicitud:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}