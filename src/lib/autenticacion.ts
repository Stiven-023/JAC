'use server';

import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables de entorno de Supabase incompletas.');
}

// Cliente con permisos de administrador
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);


// Registro usuario
export async function registrarUsuario(formData: FormData) {

  let email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('name') as string;
  let document_number = formData.get('id') as string;
  const contact_info = formData.get('phone') as string;
  const apartment_number = formData.get('apartment') as string;


  console.log({
    email,
    password,
    full_name,
    document_number,
    contact_info,
    apartment_number
  });

  //Validar el Correo
  email = email.trim().toLowerCase();
  if (!email.includes('@')) {
    return { success: false, message: 'El formato del correo electrónico es inválido.' };
  }

  //Número de Documento contenga cc y se guarde en mayuscula
  document_number = document_number?.trim().toUpperCase();
  if (!document_number.startsWith('CC')) {
    document_number = 'CC' + document_number;
  }

  //  Validar Contacto (mínimo 7, máximo 10 dígitos)
  const contactDigits = contact_info; // Solo números
  console.log(contactDigits);

  if (contactDigits.length < 7 || contactDigits.length > 10) {
    return { success: false, message: 'El número de contacto debe tener entre 7 y 10 dígitos.' };
  }

  // Validar Contraseña
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un caracter especial.'
    };
  }

  // Busca si ya existe un registro con ese número de documento
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

  // registro en Auth
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

  // Registro en residents 
  const userId = authData.user?.id;

  if (userId) {
    const { error: dbError } = await supabaseAdmin
      .from('residents')
      .insert({
        id_residentes: userId,
        full_name,
        document_number,
        contact_info,
        apartment_number,
        is_admin: false,
        estado: true,
      });

    if (dbError) {
      console.error('Error al insertar en tabla residents:', dbError.message);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.error('ERROR CRÍTICO: Fallo el rollback, el usuario sigue en Auth:', deleteError.message);
        return {
          success: false,
          message: 'Error de consistencia. Contacta al administrador.'
        };
      }
      return {
        success: false,
        message: 'Ocurrió algo inesperado. Por favor, intenta nuevamente.'
      };
    }
  }
  return {
    success: true,
    message: 'Usuario creado exitosamente'
  }
}



// Iniciar Sesión
export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createRouteHandlerClient({ cookies });

  // Iniciar sesión
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { success: false, message: 'Credenciales inválidas o cuenta no confirmada.' };
  }

  const userId = data.user?.id;
  // 3. Redirigir al usuario al dashboard principal
  return {
    success: true,
    userId: userId,
  };
}

//Cierra la sesión del usuario actual.
export async function cerrarSesion() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      return { success: false, message: 'No se pudo cerrar la sesión. Intenta nuevamente.' };
    }

    return { success: true, message: 'Sesión cerrada exitosamente.' };
  } catch (error) {
    console.error('Error inesperado al cerrar sesión:', error);
    return { success: false, message: 'Ocurrió un error inesperado al cerrar sesión.' };
  }
}