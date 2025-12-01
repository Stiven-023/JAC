'use server'


import { revalidatePath } from 'next/cache'
import { supabase } from '../supabase'

export interface Evento {
    id_evento:number,
    resident_id: string,
    titulo:string,
    descripcion?:string,
    fecha_publicacion: string,
    fecha_evento:string,
    rango_horario:string,
    lugar:string
}

export type ActionResultEvento = {
  success: boolean
  data?: Evento | Evento[]
  error?: string
}


export async function getEventos(): Promise<ActionResultEvento> {
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


export async function createEvento(formData : {
      resident_id: string,
      titulo: string,
      descripcion?: string,
      fecha_publicacion: string,
      fecha_evento: string,
      rango_horario: string,
      lugar: string
   }
): Promise<ActionResultEvento> {
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

    revalidatePath('/admin/eventos')

    return { success: true, data }

  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al crear el evento' }
  }
}


export async function updateEvento(id: number, evento: Partial<Evento>): Promise<ActionResultEvento> {
  try {
    
    const { data, error } = await supabase
      .from('evento')
      .update(evento)
      .eq('id_evento', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/eventos')

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

    revalidatePath('/admin/eventos')

    return { success: true }

  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el evento' }
  }
}