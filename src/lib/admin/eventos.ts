'use server'


import { revalidatePath } from 'next/cache'
import type { Noticia } from '../supabase'
import { supabase } from '../supabase'

export type ActionResult = {
  success: boolean
  data?: Noticia | Noticia[]
  error?: string
}

export async function getEventos(): Promise<ActionResult> {
  try {
    const { data, error } = await supabase
      .from('evento')
      .select('*')

    if (error) throw error

    return { success: true, data: data || [] }

  } catch (error) {
    console.error('Error fetching noticias:', error)
    return { success: false, error: 'Error al obtener las eventos' }
  }
}