import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Noticia = {
  id_noticia: number
  resident_id: string
  titulo: string
  contenido: string
  fecha_publicacion: string
}

export type Database = {
  public: {
    Tables: {
      noticia: {
        Row: Noticia
        Insert: Omit<Noticia, 'id_noticia'>
        Update: Partial<Omit<Noticia, 'id_noticia'>>
      }
    }
  }
}