import { supabase } from '@/lib/supabase';
import { Event } from './types';

export async function obtenerEventos(): Promise<Event[]> {
    const { data: events, error } = await supabase
        .from('evento')
        .select(`
            id_evento, 
            titulo, 
            fecha_evento,
            descripcion
        `).order('fecha_evento', { ascending: false });
    if (error) {
        console.error('Error al obtener la lista de eventos', error.message);

        throw new Error('No se pudo cargar la lista de eventos. Error de BD.');
    }

    const domainEvents: Event[] = [];

    for (const event of events) {
        domainEvents.push({
            id: event.id_evento,
            title: event.titulo,
            date: event.fecha_evento,
            description: event.descripcion,
        })
    }

    return domainEvents;
}
