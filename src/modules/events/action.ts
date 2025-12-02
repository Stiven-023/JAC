import { supabase } from '@/lib/supabase';
import { Event, ResponseEvents } from './types';

const ITEMS_PER_PAGE = 2;

export async function obtenerEventos(page: number = 1): Promise<ResponseEvents> {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
        const { data: events, count, error } = await supabase
            .from('evento')
            .select(`
                id_evento, 
                titulo, 
                fecha_evento,
                descripcion
            `, { count: 'exact' })
            .range(from, to)
            .order('fecha_evento', { ascending: false });

        if (error) throw new Error('No se pudo cargar la lista de eventos. Error de BD.');

        const domainEvents: Event[] = [];

        for (const event of events) {
            domainEvents.push({
                id: event.id_evento,
                title: event.titulo,
                date: event.fecha_evento,
                description: event.descripcion,
            });
        }

        const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

        return {
            data: domainEvents,
            totalPages,
        };
    } catch (error) {
        console.error(error);
        return {
            data: [],
            totalPages: 0,
        };
    }
}