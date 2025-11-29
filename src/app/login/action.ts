'use server';

import { 
    registrarUsuario, 
    iniciarSesion, 
    cerrarSesion
} from '@/lib/autenticacion'; 

// Definimos el tipo de estado
export type State = {
    success?: boolean
    message?: string;
    values?: {
    email?: string;
    password?: string;
    name?: string;
    id?:string;
    phone?:string;
    apartment?: string;
  };
}

// --- ACCIÓN DE INICIO DE SESIÓN ---
export async function manejarInicioSesion(prevState: State, formData: FormData){
    
    try {
        
        const result = await iniciarSesion(formData);

        if (!result.success) {
            return {
                message : result?.message,
                values: Object.fromEntries(formData) as State["values"]
            }
        }

        return {
            success : true
        }
        
    
    } catch (error) {
        console.log(error);
        return {
            message : 'Algo salio mal '
        }
    }

}

// --- ACCIÓN DE REGISTRO ---
export async function manejarRegistro(prevState: State, formData: FormData): Promise<State> {

    try {
        
    
    const result = await registrarUsuario(formData);

    if (!result.success) {
        // Si hay un error, devolvemos el nuevo estado con el mensaje de error
        return { 
            message: result.message,
            values: Object.fromEntries(formData)
        }; 
    }

    return {
        success: true,
        message: 'Usuario registrado exitosamente'
    }

    } catch (error) {
        console.error(error)
        return {
            message: 'no se pudo crear el usuario'
        }
    }
}


// --- ACCIÓN DE CIERRE DE SESIÓN ---
export async function manejarCierreSesion(): Promise<State> {
    try {
        const result = await cerrarSesion();
        
        if (!result.success) {
            return {
                success: false,
                message: result.message
            };
        }

        return {
            success: true,
            message: result.message
        };
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return {
            success: false,
            message: 'Error inesperado al cerrar sesión.'
        };
    }
}