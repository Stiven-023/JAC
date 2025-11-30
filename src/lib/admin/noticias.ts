'use server'

import { revalidatePath } from 'next/cache'
// Importa los tipos correctos de tu archivo de tipos de Supabase
import type { NoticiaConResidente } from '@/lib/supabase' 
import { supabase } from '@/lib/supabase'

// El resultado puede ser un array o un solo objeto, pero SIEMPRE del tipo anidado
export type ActionResult = {
  success: boolean
  data?: NoticiaConResidente[] | NoticiaConResidente 
  error?: string
}

// 1. OBTENER (Lectura)
export async function getNoticias(): Promise<ActionResult> {
  try {
    const { data, error } = await supabase
      .from('noticia')
      .select(`*, residents (full_name)`) // JOIN correcto
      .order('fecha_publicacion', { ascending: false })

    if (error) throw error
    
    // Devolvemos directamente el tipo anidado
    return { success: true, data: data as NoticiaConResidente[] } 
  } catch (error) {
    console.error('Error fetching noticias:', error)
    return { success: false, error: 'Error al obtener las noticias' }
  }
}

// 2. CREAR
export async function createNoticia(formData: {
  resident_id: string
  titulo: string
  contenido: string
}): Promise<ActionResult> {
  try {
    const { data, error } = await supabase
      .from('noticia')
      .insert([{
        ...formData,
        fecha_publicacion: new Date().toISOString()
      }])
      .select(`*, residents (full_name)`) // JOIN para obtener el nombre inmediatamente
      .single()

    if (error) throw error
    
    revalidatePath('/noticias')
    return { success: true, data: data as NoticiaConResidente }
  } catch (error) {
    console.error('Error creating noticia:', error)
    return { success: false, error: 'Error al crear la noticia' }
  }
}

// 3. ACTUALIZAR
export async function updateNoticia(
  id: number,
  formData: {
    resident_id: string
    titulo: string
    contenido: string
  }
): Promise<ActionResult> {
  try {
    const { data, error } = await supabase
      .from('noticia')
      .update(formData)
      .eq('id_noticia', id)
      .select(`*, residents (full_name)`) // JOIN para obtener el nombre inmediatamente
      .single()

    if (error) throw error
    
    revalidatePath('/noticias')
    return { success: true, data: data as NoticiaConResidente }
  } catch (error) {
    console.error('Error updating noticia:', error)
    return { success: false, error: 'Error al actualizar la noticia' }
  }
}

// 4. ELIMINAR (Sin cambios, no devuelve datos complejos)
export async function deleteNoticia(id: number): Promise<ActionResult> {
  try {
    const { error } = await supabase
      .from('noticia')
      .delete()
      .eq('id_noticia', id)

    if (error) throw error
    
    revalidatePath('/noticias')
    return { success: true }
  } catch (error) {
    console.error('Error deleting noticia:', error)
    return { success: false, error: 'Error al eliminar la noticia' }
  }
}