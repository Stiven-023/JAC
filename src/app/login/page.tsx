'use client';

import MainFooter from '@/components/MainFooter';

import { useActionState, useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';


import { manejarRegistro, manejarInicioSesion, type State } from './action';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { LoginForm } from '@/components/login/LoginForm';
import { RegisterForm } from '@/components/login/RegisterForm';
const initialState: State = { success: false, message: '' };

export default function LoginPage() {

  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  const [view, setView] = useState<'login' | 'register'>('login');

  // Se usa useFormState temporalmente
  const [loginState, loginDispatch] = useActionState(manejarInicioSesion, initialState);
  const [registerState, registerDispatch] = useActionState(manejarRegistro, initialState);


  useEffect(() => {
        if (loginState.success) {
            redirect('/home');
        }
  }, [loginState]);

  if (loginState.success) {
    redirect('/home' );
  }

  if (registerState.success){
    redirect('/login' );
  }


  return (
    <div className='flex flex-col min-h-screen' style={{background:'red'}}>
     <header className='flex shadow-md bg-red-primary text-white py-2 h-24'>
                <div className='flex px-4 space-x-4 justify-between'>
                    <div className='flex justify-center items-center px-4 space-x-4'>
                        <Link href={'/'} className='rounded-full bg-white p-2  '>
                            <FaHome size={24} color="red" />
                        </Link>
                        <div >
                            <h1>JAC</h1>
                            <p className='text-xs'>Junta de accion comunal </p>
                        </div>
                    </div>
        
                </div>
    
     </header>

    <div className="flex flex-col items-center justify-center flex-1 p-4 bg-gray-50">
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
          {view === 'login' ? (<LoginForm action={loginDispatch} state={loginState} />) : (<RegisterForm action={registerDispatch} state={registerState} />)}
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
    <MainFooter/>
    </div>
  );
}

