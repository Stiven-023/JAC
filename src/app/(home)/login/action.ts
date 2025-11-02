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
}

// --- ACCIÓN DE INICIO DE SESIÓN ---
export async function manejarInicioSesion(prevState: State, formData: FormData): Promise<State> {
    const result = await iniciarSesion(formData);

    if (!result.success) {
        // Si hay un error, devolvemos el nuevo estado con el mensaje de error
        return { message: result.message };
    }
    
    // Éxito: Redirige a /home
    redirect('/home'); 
}

// --- ACCIÓN DE REGISTRO ---
export async function manejarRegistro(prevState: State, formData: FormData): Promise<State> {
    const result = await registrarUsuario(formData);

    if (!result.success) {
        // Si hay un error, devolvemos el nuevo estado con el mensaje de error
        return { message: result.message }; 
    }
    
    // ✅ Éxito: Redirige a / (inicio)
    redirect('/'); 
}