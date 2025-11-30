import { supabase } from "@/lib/supabase";
import { NewTypes } from "./types";

export async function obtenerNoticias(): Promise<NewTypes[]> {
    const { data: news, error } = await supabase
        .from('noticia')
        .select(`
            id_noticia, 
            titulo, 
            fecha_publicacion,
            contenido
        `).order('fecha_publicacion', { ascending: false });
    if (error) {
        console.error('Error al obtener las noticias', error.message);

        throw new Error('No se pudo cargar la lista de noticias. Error de BD.');
    }

    const domainNews: NewTypes[] = [];

    for (const release of news) {
        domainNews.push({
            id: release.id_noticia,
            title: release.titulo,
            date: release.fecha_publicacion,
            description: release.contenido


        })
    }
    return domainNews;


}