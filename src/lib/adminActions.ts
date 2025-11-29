'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// conexion con DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables de entorno de Supabase incompletas.');
}

// Permisos de Admin
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);


export type ResidenteAdmin = {
    id_residentes: string;
    full_name: string;
    document_number: string;
    contact_info: string;
    apartment_number: string;
    is_admin: boolean;
    estado: boolean;
};


export async function obtenerListaResidentesAdmin(): Promise<ResidenteAdmin[]> {
    const { data: residentes, error } = await supabaseAdmin
        .from('residents')
        .select(`
            id_residentes, 
            full_name, 
            document_number, 
            contact_info,
            apartment_number, 
            is_admin,
            estado
        `)
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error al obtener la lista de residentes para el Admin:', error.message);
        
        throw new Error('No se pudo cargar la lista de usuarios. Error de BD.');
    }

    return residentes as ResidenteAdmin[];
}

export async function actualizarResidenteAdmin(formData: FormData) {
    const id_residentes = formData.get('id_residentes') as string;
    const is_admin_nuevo = formData.get('is_admin') === 'true';
    const full_name_nuevo = formData.get('full_name') as string;
    const estado_nuevo = formData.get('estado') === 'true';

    const { error } = await supabaseAdmin
        .from('residents')
        .update({
            full_name: full_name_nuevo,
            is_admin: is_admin_nuevo,
            estado: estado_nuevo
        })
        .eq('id_residentes', id_residentes);

    if (error) {
        console.error('Error al actualizar residente:', error.message);
        return { success: false, message: 'Fallo al actualizar el perfil.' };
    }

    // Actualiza la caché de la página de gestión de usuarios
    revalidatePath('/admin/usersManagement');
    
    return { success: true, message: 'Residente actualizado exitosamente.' };
}

export async function eliminarResidenteAdmin(id_residentes: string) {
    try {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id_residentes);

        if (authError) {
            // si no esta el usuario de la tabla Auth continua 
            if (authError.message === 'User not found') {
                console.warn('[SUPABASE AUTH] Usuario no encontrado. Procediendo a eliminar el registro de la tabla residents.');
            } else {
                // Error de permisos 
                return { success: false, message: 'Fallo al eliminar el usuario de autenticación.' };
            }
        }

        // Elimina de la tabla de residents
        const { error: dbError } = await supabaseAdmin
            .from('residents')
            .delete()
            .eq('id_residentes', id_residentes);

        if (dbError) {
            console.error('ERROR CRÍTICO: Fallo al eliminar el perfil de la BD. ID:', id_residentes);
            return { success: false, message: 'Error de consistencia en la BD. Perfil restante.' };
        }
        
        revalidatePath('/admin/usersManagement');
        return { success: true, message: 'Usuario eliminado completamente.' };

    } catch (e) {
        console.error("ERROR CRÍTICO INESPERADO en eliminarResidenteAdmin:", e);
        return { success: false, message: 'Error interno en el servidor. Intente de nuevo.' };
    }
}

//--------------------------------------IMPLEMENTACION DE SERVICIOS---------------------------------------------------------------
export type ServicioDisponible = {
    id_servicio: number;
    titulo_servicio: string;
    descripcion_short: string;
    descripcion_full: string | null;
    icono_nombre: string | null;
    is_activo: boolean;
};

// Tipo para la tabla de Solicitudes
export type Solicitud = {
    id_solicitud: number;
    resident_id: string; 
    id_servicio: number;
    descripcion: string;
    direccion: string;
    estado: 'en_tramite' | 'atendida' | 'cerrada'; // Asumiendo este enum
    fecha_creacion: string;
    fecha_actualizacion: string | null;

    // Campos JOIN
    titulo_servicio: string;
    resident_name: string;
};


// --- CRUD de Servicios Disponibles (Administrador) ---

// 1. Obtener lista de servicios
export async function obtenerListaServiciosAdmin(): Promise<ServicioDisponible[]> {
    const { data: servicios, error } = await supabaseAdmin
        .from('servicios_disponibles')
        .select(`
            id_servicio,
            titulo_servicio,
            descripcion_short,
            descripcion_full,
            icono_nombre,
            is_activo
        `)
        .order('titulo_servicio', { ascending: true });

    if (error) {
        console.error('Error al obtener la lista de servicios disponibles:', error.message);
        throw new Error('No se pudo cargar la lista de servicios disponibles. Error de BD.');
    }

    return servicios as ServicioDisponible[];
}

// 2. CREAR Nuevo Servicio Disponible
export async function crearServicioDisponible(formData: FormData) {
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const icono_nombre = formData.get('icono_nombre') as string | null;
    // El checkbox debe enviar 'true' o 'false', o se asume 'true' si está ausente.
    const is_activo = formData.get('is_activo') === 'true'; 

    if (!titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios (Título y descripción corta).' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .insert({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                icono_nombre: icono_nombre || null,
                is_activo,
            });

        if (error) {
            console.error('Error al crear servicio:', error.message);
            if (error.code === '23505') { 
                 return { success: false, message: `El servicio "${titulo_servicio}" ya existe.` };
            }
            return { success: false, message: 'Fallo al registrar el nuevo servicio.' };
        }

        revalidatePath('/home/admin'); // Revalida la página Admin completa para actualizar la lista
        return { success: true, message: 'Servicio creado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al crear servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

// 3. ACTUALIZAR Servicio Disponible
export async function actualizarServicioDisponible(formData: FormData) {
    const id_servicio = formData.get('id_servicio') as string;
    const titulo_servicio = formData.get('titulo_servicio') as string;
    const descripcion_short = formData.get('descripcion_short') as string;
    const descripcion_full = formData.get('descripcion_full') as string | null;
    const icono_nombre = formData.get('icono_nombre') as string | null;
    const is_activo = formData.get('is_activo') === 'true'; 

    if (!id_servicio || !titulo_servicio || !descripcion_short) {
        return { success: false, message: 'Faltan campos obligatorios o ID del servicio.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .update({
                titulo_servicio,
                descripcion_short,
                descripcion_full: descripcion_full || null,
                icono_nombre: icono_nombre || null,
                is_activo,
            })
            .eq('id_servicio', parseInt(id_servicio));

        if (error) {
            console.error('Error al actualizar servicio:', error.message);
             if (error.code === '23505') { 
                 return { success: false, message: `El servicio "${titulo_servicio}" ya existe con otro registro.` };
            }
            return { success: false, message: 'Fallo al actualizar el servicio.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Servicio actualizado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al actualizar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

// 4. ELIMINAR Servicio Disponible
export async function eliminarServicioDisponible(id_servicio: number) {
    if (!id_servicio) {
        return { success: false, message: 'ID del servicio es obligatorio para eliminar.' };
    }
    
    try {
        const { error } = await supabaseAdmin
            .from('servicios_disponibles')
            .delete()
            .eq('id_servicio', id_servicio);

        if (error) {
            console.error('Error al eliminar servicio:', error.message);
            // Maneja la violación de Clave Foránea (Foreign Key Violation)
            if (error.code === '23503') { 
                 return { success: false, message: 'No se puede eliminar: Este servicio tiene solicitudes asociadas activas.' };
            }
            return { success: false, message: 'Fallo al eliminar el servicio.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Servicio eliminado exitosamente.' };

    } catch (e) {
        console.error("Error crítico al eliminar servicio:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}

// --- Gestión de Solicitudes (Administrador) ---

// 5. OBTENER Lista de Solicitudes (Admin)
export async function obtenerListaSolicitudesAdmin(): Promise<Solicitud[]> {
    const { data: solicitudes, error } = await supabaseAdmin
        .from('solicitudes')
        .select(`
            id_solicitud,
            resident_id,
            id_servicio,
            descripcion,
            direccion,
            estado,
            fecha_creacion,
            fecha_actualizacion,
            servicios_disponibles ( titulo_servicio ),
            residents ( full_name ) 
        `)
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error('Error al obtener la lista de solicitudes:', error.message);
        throw new Error('No se pudo cargar la lista de solicitudes. Error de BD.');
    }

    // Mapear el resultado para aplanar los JOINs y que coincida con el tipo 'Solicitud'
    return solicitudes.map((solicitud: any) => ({
        ...solicitud,
        titulo_servicio: solicitud.servicios_disponibles.titulo_servicio,
        resident_name: solicitud.residents.full_name,
    })) as Solicitud[];
}

// 6. ACTUALIZAR Estado de Solicitud (Admin)
export async function actualizarEstadoSolicitud(id_solicitud: number, nuevoEstado: Solicitud['estado']) {
    if (!id_solicitud || !nuevoEstado) {
        return { success: false, message: 'ID y nuevo estado son obligatorios.' };
    }
    
    try {
        const { error } = await supabaseAdmin
            .from('solicitudes')
            .update({ 
                estado: nuevoEstado, 
                fecha_actualizacion: new Date().toISOString() // Registrar la fecha de cambio
            })
            .eq('id_solicitud', id_solicitud);

        if (error) {
            console.error('Error al actualizar estado de solicitud:', error.message);
            return { success: false, message: 'Fallo al actualizar el estado.' };
        }

        revalidatePath('/home/admin');
        return { success: true, message: 'Estado de solicitud actualizado.' };

    } catch (e) {
        console.error("Error crítico al actualizar estado:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}


// --- Solicitudes (Residente - Necesario para el flujo completo) ---

// 7. CREAR Nueva Solicitud (Residente)
export async function crearNuevaSolicitud(formData: FormData, residentId: string) {
    // Nota: El residente NO tiene permisos de admin, pero esta Server Action se ejecuta en el servidor.
    const id_servicio = formData.get('id_servicio') as string; // Viene del ServiceCard
    const descripcion = formData.get('descripcion') as string;
    const direccion = formData.get('direccion') as string;
    
    if (!id_servicio || !descripcion || !direccion || !residentId) {
        return { success: false, message: 'Faltan datos obligatorios para crear la solicitud.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('solicitudes')
            .insert({
                resident_id: residentId,
                id_servicio: parseInt(id_servicio),
                descripcion,
                direccion,
                estado: 'en_tramite'
            });

        if (error) {
            console.error('Error al crear nueva solicitud:', error.message);
            return { success: false, message: 'Fallo al registrar la solicitud. Intente de nuevo.' };
        }

        // No es necesario revalidar el admin, pero quizás la página del residente
        // revalidatePath('/home/mis-solicitudes'); 

        return { success: true, message: 'Solicitud enviada con éxito. Será atendida pronto.' };

    } catch (e) {
        console.error("Error crítico al crear solicitud:", e);
        return { success: false, message: 'Error interno del servidor.' };
    }
}