'use server'

import { revalidatePath } from 'next/cache'
// Asegúrate de que la ruta a tu cliente de supabase sea correcta
import { supabase } from '@/lib/supabase' 

// --- TIPOS ---

export interface Evento {
    id_evento: number,
    resident_id: string,
    titulo: string,
    descripcion?: string,
    fecha_publicacion: string,
    fecha_evento: string,
    rango_horario: string,
    lugar: string
}

// Tipo para Inscripciones (Join con Residentes y Eventos)
export interface Inscripcion {
    id_inscripcion: number;
    id_evento: number;
    resident_id: string;
    fecha_inscripcion: string;
    // Campos traídos por relación (Join)
    resident_name: string;
    titulo_evento: string;
}

type InscripcionDB = {
    id_inscripcion: number;
    id_evento: number;
    resident_id: string;
    fecha_inscripcion: string;
    residents: { full_name: string } | null;
    evento: { titulo: string } | null;
};

// Tipo auxiliar para respuesta de BD
export type ActionResultEvento<T = unknown> = {
    success: boolean
    data?: T
    error?: string
}

// ==========================================
// LÓGICA DE EVENTOS (MAESTRO)
// ==========================================

export async function getEventos(): Promise<ActionResultEvento<Evento[]>> {
    try {
        const { data, error } = await supabase
            .from('evento')
            .select('*')
            .order('fecha_evento', { ascending: true }) // Ordenar por fecha del evento

        if (error) throw error

        return { success: true, data: data || [] }

    } catch (error) {
        console.error('Error fetching eventos:', error)
        return { success: false, error: 'Error al obtener los eventos' }
    }
}

export async function createEvento(formData: {
    resident_id: string,
    titulo: string,
    descripcion?: string,
    fecha_publicacion: string,
    fecha_evento: string,
    rango_horario: string,
    lugar: string
}): Promise<ActionResultEvento<Evento>> {
    try {
        const { data, error } = await supabase
            .from('evento')
            .insert([{
                ...formData,
                descripcion: formData.descripcion || '',
                fecha_publicacion: new Date().toISOString()
            }])
            .select()
            .single()

        if (error) throw error

        revalidatePath('/home/admin') 
        return { success: true, data }

    } catch (error) {
        console.error(error)
        return { success: false, error: 'Error al crear el evento' }
    }
}

export async function updateEvento(id: number, evento: Partial<Evento>): Promise<ActionResultEvento<Evento>> {
    try {
        const { data, error } = await supabase
            .from('evento')
            .update(evento)
            .eq('id_evento', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/home/admin')
        return { success: true, data }

    } catch (error) {
        console.error(error)
        return { success: false, error: 'Error al actualizar el evento' }
    }
}

export async function deleteEvento(id: number): Promise<ActionResultEvento> {
    try {
        const { error } = await supabase
            .from('evento')
            .delete()
            .eq('id_evento', id)

        if (error) throw error

        revalidatePath('/home/admin')
        return { success: true }

    } catch (error) {
        console.error(error)
        return { success: false, error: 'Error al eliminar el evento' }
    }
}

// ==========================================
// LÓGICA DE INSCRIPCIONES (DETALLE)
// ==========================================

export async function obtenerInscripcionesAdmin(): Promise<Inscripcion[]> {
    try {
        const { data, error } = await supabase
            .from('inscripcion_evento')
            .select(`
                id_inscripcion,
                id_evento,
                resident_id,
                fecha_inscripcion,
                residents ( full_name ),
                evento ( titulo )
            `)
            .order('fecha_inscripcion', { ascending: false });

        if (error) throw error;

        // 🛠️ CORRECCIÓN: Usamos 'unknown' primero y luego el tipo 'InscripcionDB'
        // Esto le dice a TS: "Confía en mí, la estructura es esta"
        const rawData = data as unknown as InscripcionDB[];

        // Mapeo seguro usando el tipo definido
        return rawData.map(row => ({
            id_inscripcion: row.id_inscripcion,
            id_evento: row.id_evento,
            resident_id: row.resident_id,
            fecha_inscripcion: row.fecha_inscripcion,
            resident_name: row.residents?.full_name || 'Desconocido',
            titulo_evento: row.evento?.titulo || 'Evento eliminado'
        }));

    } catch (error) {
        console.error('Error obteniendo inscripciones:', error);
        return [];
    }
}

export async function eliminarInscripcion(id_inscripcion: number): Promise<ActionResultEvento> {
    try {
        const { error } = await supabase
            .from('inscripcion_evento')
            .delete()
            .eq('id_inscripcion', id_inscripcion);

        if (error) throw error;

        revalidatePath('/home/admin');
        return { success: true };
    } catch (error) {
        console.error('Error eliminando inscripción:', error);
        return { success: false, error: 'No se pudo eliminar la inscripción.' };
    }
}