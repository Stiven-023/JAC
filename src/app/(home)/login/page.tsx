// src/app/login/page.tsx
'use client';

import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// Revertimos la importación para evitar problemas
import { useFormStatus, useFormState } from 'react-dom';


// Se llaman las Server Actions y el tipo State desde action.ts
import { manejarRegistro, manejarInicioSesion, type State } from './action';

const initialState: State = { message: '' };

export default function LoginPage() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  const [view, setView] = useState<'login' | 'register'>('login');

  // Se usa useFormState temporalmente
  const [loginState, loginDispatch] = useActionState(manejarInicioSesion, initialState);
  const [registerState, registerDispatch] = useActionState(manejarRegistro, initialState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Contenedor principal */}
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-2xl border-4 border-gray-400">
        <h1 className="text-2xl font-bold text-center text-gray-800">{view === 'login' ? 'Iniciar Sesión' : 'Registrar Residente'}</h1>

        {/* Mensajes */}
        {initialMessage && (<div className="p-3 mt-4 text-sm text-center text-green-700 bg-green-100 rounded-md">{initialMessage}</div>)}
        {view === 'login' && loginState?.message && (<p className="mt-4 text-sm text-center text-red-600">{loginState.message}</p>)}
        {view === 'register' && registerState?.message && (
          <p className={`mt-4 text-sm text-center ${registerState.message.includes('exitoso') ? 'text-green-600' : 'text-red-600'}`}>
            {registerState.message}
          </p>
        )}

        <div className="mt-6">
          {view === 'login' ? (<LoginForm action={loginDispatch} />) : (<RegisterForm action={registerDispatch} />)}
        </div>

        {/* Alternar vistas */}
        <p className="mt-6 text-sm text-center text-gray-600">
          {view === 'login' ? (
            <>¿No tienes cuenta aún? <button type="button" onClick={() => setView('register')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Regístrate</button></>
          ) : (
            <>¿Ya tienes cuenta? <button type="button" onClick={() => setView('login')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Inicia Sesión</button></>
          )}
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Componentes Reutilizables
// -------------------------------------------------------------------

function SubmitButton({ label, loadingLabel, bgColor }: { label: string, loadingLabel: string, bgColor: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full text-white rounded-sm px-2 py-2 mt-4 transition-all disabled:opacity-50 ${bgColor} **cursor-pointer**`}
    >
      {pending ? loadingLabel : label}
    </button>
  );
}

// -------------------------------------------------------------------
// Componente del Formulario de INICIO DE SESIÓN
// -------------------------------------------------------------------
function LoginForm({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action} className="flex flex-col space-y-3">
      <label className="text-xs text-gray-700">Correo Electrónico</label>
      <input type="email" name="email" id="email" required className="bg-gray-200 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />

      <label className="text-xs text-gray-700">Contraseña</label>
      <input type="password" name="password" id="password" required className="bg-gray-200 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />

      <SubmitButton label="Ingresar" loadingLabel="Verificando..." bgColor="bg-red-primary hover:bg-red-700 cursor-pointer" />
    </form>
  );
}

// -------------------------------------------------------------------
// Componente del Formulario de REGISTRO
// -------------------------------------------------------------------
function RegisterForm({ action }: { action: (formData: FormData) => void }) {

  return (
    <form action={action} className="space-y-4">

      {/* Grupo 1: Credenciales */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700">Credenciales</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Correo Electrónico */}
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Correo Electrónico</label>
          <input type="email" name="email" required className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>

        {/* Contraseña (Simple) */}
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            className={`w-full rounded-md px-3 py-2 text-sm bg-gray-200 border border-gray-300`}
          />

        </div>
      </div>

      {/* Grupo 2: Datos Personales */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700 mt-4">Datos Personales</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Nombre Completo</label>
          <input type="text" name="full_name" required className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Número de Documento</label>
          <input type="text" name="document_number" required className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Grupo 3: Contacto y Apartamento */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700 mt-4">Ubicación y Contacto</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Contacto (Teléfono/Otro)</label>
          <input type="text" name="contact_info" required className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Número de Apartamento</label>
          <input type="text" name="apartment_number" required className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Botón de Envío */}
      <SubmitButton label="Registrarme" loadingLabel="Registrando..." bgColor="bg-red-primary hover:bg-red-700 cursor-pointer" />
    </form>
  );
}