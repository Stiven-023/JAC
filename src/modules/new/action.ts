import { supabase } from "@/lib/supabase";
import { NewTypes, ResponseNews } from "./types";

const ITEMS_PER_PAGE = 2;

export async function obtenerNoticias(page: number = 1): Promise<ResponseNews> {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
        const { data: news, count, error } = await supabase
            .from('noticia')
            .select(`
            id_noticia, 
            titulo, 
            fecha_publicacion,
            contenido
        `, { count: 'exact' })
            .range(from, to)
            .order('fecha_publicacion', { ascending: false })

        if (error) throw new Error('No se pudo cargar la lista de noticias. Error de BD.');

        const domainNews: NewTypes[] = [];

        for (const release of news) {
            domainNews.push({
                id: release.id_noticia,
                title: release.titulo,
                date: release.fecha_publicacion,
                description: release.contenido
            })
        }
        const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

        return {
            data: domainNews,
            totalPages,
        };
    } catch (error) {
        console.error(error);
        return {
            data: [],
            totalPages: 0,
        };

    };
}