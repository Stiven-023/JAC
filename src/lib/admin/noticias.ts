'use server'

import { revalidatePath } from 'next/cache'
import type { NoticiaConResidente } from '@/lib/supabase' 
import { supabase } from '@/lib/supabase'
export type ActionResult = {
  success: boolean
  data?: NoticiaConResidente[] | NoticiaConResidente 
  error?: string
}

export async function getNoticias(): Promise<ActionResult> {
  try {
    const { data, error } = await supabase
      .from('noticia')
      .select(`*, residents (full_name)`)
      .order('fecha_publicacion', { ascending: false })

    if (error) throw error
    
    return { success: true, data: data as NoticiaConResidente[] } 
  } catch (error) {
    console.error('Error fetching noticias:', error)
    return { success: false, error: 'Error al obtener las noticias' }
  }
}

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
      .select(`*, residents (full_name)`)
      .single()

    if (error) throw error
    
    revalidatePath('/noticias')
    return { success: true, data: data as NoticiaConResidente }
  } catch (error) {
    console.error('Error creating noticia:', error)
    return { success: false, error: 'Error al crear la noticia' }
  }
}

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
      .select(`*, residents (full_name)`)
      .single()

    if (error) throw error
    
    revalidatePath('/noticias')
    return { success: true, data: data as NoticiaConResidente }
  } catch (error) {
    console.error('Error updating noticia:', error)
    return { success: false, error: 'Error al actualizar la noticia' }
  }
}

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