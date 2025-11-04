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
        <header className="flex flex-col shadow-md bg-red-primary  mx-auto px-4  w-full  lg:text-xl ">

            <div className="flex justify-end w-full pt-2  lg:text-sm xl:text-2xl">
                <button onClick={handleLogin} className=' rounded-md'>Iniciar sesión/ Registrarse</button>
            </div>
            <div className='flex flex-col items-center   '>
                <div className='rounded-full bg-white p-4 mb-2'>
                    <FaHome size={30} color="red" />

                </div >
                <h2 className='lg:text-md xl:text-2xl m-0 leading-tight'>JAC</h2>
                <p className='lg:text-md xl:text-2xl m-0 leading-tight'>Junta de accion comunal </p>
                <h3 className=' text-indigo-50 py-2 lg:text-md xl:text-2xl'>Bienvenido a la comunidad JAC!</h3>

            </div>
        </header >

    )


}