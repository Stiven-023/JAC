// src/app/login/action.ts
'use server';

import { redirect } from 'next/navigation'; // <-- AGREGADO

import { 
    registrarUsuario, 
    iniciarSesion 
} from '@/lib/autenticacion'; // Importamos las funciones de backend seguro

// Definimos el tipo de estado
export type State = {
    message: string;
    values?: {
    email?: string;
    password?: string;
    name?: string;
    id?:number;
    phone?:number;
    apartment?: number;
  };
}

// --- ACCIÓN DE INICIO DE SESIÓN ---
export async function manejarInicioSesion(prevState: State, formData: FormData): Promise<State> {
    
    try {
        
        const result = await iniciarSesion(formData);

        if (!result.success) {
            return {
                message : result?.message,
                values: Object.fromEntries(formData) as State["values"]
            }
        }

        redirect('/home')
    
    } catch (error) {
        console.log(error);
        return {
            message : 'algo salio mal'
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

    console.log(result)
    
    // ✅ Éxito: Redirige a / (inicio)
    redirect('/');

    } catch (error) {
        console.error(error)
        return {
            message: 'no se pudo crear el usuario'
        }
    }
}