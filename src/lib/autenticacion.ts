'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';


// --- CONFIGURACIÓN DE CONEXIÓN CON SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables de entorno de Supabase incompletas.');
}

// Cliente con permisos de administrador (service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);


// --- REGISTRO DE USUARIO ---
export async function registrarUsuario(formData: FormData) {
  let email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  let document_number = formData.get('document_number') as string;
  const contact_info = formData.get('contact_info') as string;
  const apartment_number = formData.get('apartment_number') as string;

  // [Código de Validación Omitido para Brevedad]

  // A. Validar el Correo
  email = email.trim().toLowerCase();
  if (!email.includes('@')) {
    return { success: false, message: 'El formato del correo electrónico es inválido.' };
  }

  // B. Número de Documento contenga cc y se guarde en mayuscula
  document_number = document_number.trim().toUpperCase();
  if (!document_number.startsWith('CC')) {
    document_number = 'CC' + document_number;
  }

  // C. Validar Contacto (mínimo 7, máximo 10 dígitos)
  const contactDigits = contact_info.replace(/\D/g, ''); // Solo números
  if (contactDigits.length < 7 || contactDigits.length > 10) {
    return { success: false, message: 'El número de contacto debe tener entre 7 y 10 dígitos.' };
  }

  // D. Validar Contraseña
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un caracter especial.'
    };
  }

  // E. Busca si ya existe un registro con ese número de documento
  const { data: residentExists, error: uniquenessError } = await supabaseAdmin
    .from('residents')
    .select('document_number')
    .eq('document_number', document_number)
    .maybeSingle();

  if (uniquenessError) {
    console.error('Error al verificar unicidad de documento:', uniquenessError.message);
    return { success: false, message: 'Fallo al verificar la base de datos (unicidad).' };
  }

  if (residentExists) {
    return { success: false, message: `Ya existe un residente registrado con el documento: ${document_number}.` };
  }

  // 1. REGISTRO EN AUTH (Crea el usuario)
  const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    }
  });

  if (authError) {
    if (authError.message.includes('User already registered')) {
      return { success: false, message: 'Ya existe un usuario con este correo electrónico.' };
    }
    return { success: false, message: authError.message };
  }

  // --- 2. REGISTRO DE RESIDENTE (PERFIL) ---
  const userId = authData.user?.id;

  if (userId) {
    const { error: dbError } = await supabaseAdmin
      .from('residents')
      .insert({
        id: userId, // Vinculación con el usuario de Auth
        full_name,
        document_number,
        contact_info,
        apartment_number,
        is_admin: false, // Rol por defecto: Residente
      });

    if (dbError) {
      console.error('Error al insertar en tabla residents:', dbError.message);

      // 3. ¡ROLLBACK! Si falla la inserción del perfil, eliminamos el usuario de Auth.
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.error('ERROR CRÍTICO: Fallo el rollback, el usuario sigue en Auth:', deleteError.message);
        return {
          success: false,
          message: 'Error de consistencia. Contacta al administrador.'
        };
      }

      // Mensaje amigable al usuario
      return {
        success: false,
        message: 'Ocurrió algo inesperado. Por favor, intenta nuevamente.'
      };
    }
  }

  // Éxito: Redirige al login.
  return redirect('/login?message=Registro exitoso. Revisa tu correo electrónico para confirmar la cuenta.');
}


// --- FUNCIÓN DE INICIO DE SESIÓN (Sin cambios)
/**
 * Inicia sesión de un usuario existente.
 */
export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Crear cliente de Supabase para manejo de cookies
  const supabase = createRouteHandlerClient({ cookies });

  // 2. Iniciar sesión
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { success: false, message: 'Credenciales inválidas o cuenta no confirmada.' };
  }

  // 3. Redirigir al usuario al dashboard principal
  return redirect('/home');
}
