'use client';
import { redirect } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link'

export default function MainHeader() {
    function handleLogin() {

        // Lógica de inicio de sesión aquí
        console.log('Iniciar sesión');
        redirect('/login');
    }
    return (
        <header className=" shadow-md bg-red-primary max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 flex flex-col w-full">

            <div className="flex justify-end w-full pt-2">
                <button onClick={handleLogin} className='border rounded-md'>iniciar sesión</button>
            </div>
            <div className='flex flex-col items-center  '>
                <div className='rounded-full bg-white p-4 mb-2'>
                    <FaHome size={30} color="red" />

                </div>
                <h2>JAC</h2>
                <p className=''>Junta de accion comunal </p>
                <h3 className='text-indigo-50 py-2'>Bienvenido a la comunidad JAC!</h3>


            </div>
        </header >

    )


}