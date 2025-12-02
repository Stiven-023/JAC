export interface Service {
    id: number;
    title: string;
    description_short: string;
    description_full?: string;
    is_active: boolean;
}

export interface ResponseServices {
    data: Service[];
    totalPages: number;
}

// Tipos para solicitudes
export interface Solicitud {
    id: number;
    resident_id: string;
    id_servicio: number;
    descripcion: string;
    direccion: string;
    estado: 'en_tramite' | 'atendida' | 'cerrada';
    fecha_creacion: string;
    fecha_actualizacion?: string;
    servicio?: {
        titulo: string;
    };
}

export interface CreateSolicitudData {
    id_servicio: number;
    descripcion: string;
    direccion: string;
}

// Para mostrar en la vista
export interface SolicitudResumen {
    id: number;
    titulo: string;
    descripcion_corta: string;
    estado: 'en_tramite' | 'atendida' | 'cerrada';
    fecha_creacion: string;
}

export interface ResponseSolicitudes {
    data: SolicitudResumen[];
    totalPages: number;
}