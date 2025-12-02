'use server'
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export type CrearSolicitudPayload = {
  userId: string | null;
  serviceId: number;
  note?: string | null;
};

export async function crearSolicitudServicio({ userId, serviceId, note }: CrearSolicitudPayload) {
  'use server';
  if (!serviceId || !userId) throw new Error('Datos incompletos');

  const { data, error } = await supabase
    .from('solicitudes') // <-- verifica nombre real
    .insert({
      resident_id: userId,
      id_servicio: serviceId,
      descripcion: note ?? null,
      direccion: null,
      estado: 'en_tramite'
    })
    .select()
    .single();

  if (error) {
    console.error('crearSolicitudServicio error', error);
    throw new Error(error.message ?? 'Error al crear solicitud');
  }

  // Revalida la ruta admin para que el administrador vea la nueva solicitud sin recargar
  revalidatePath('/home/admin'); // ajusta la ruta si tu panel admin es otra

  return { success: true, data };
}