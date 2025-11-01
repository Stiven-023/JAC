import { FaHome } from 'react-icons/fa';

import Link from 'next/link'
export default function HomeHeader() {
    return (

        <header className='shadow-md bg-red-primary text-white py-2'>
            <div className='flex px-4 space-x-4 justify-between'>
                <div className='flex px-4 space-x-4'>
                    <div className='rounded-full bg-white p-2 '>
                        <FaHome size={20} color="red" />
                    </div>
                    <div >
                        <h1>JAC</h1>
                        <p className='text-xs'>Junta de accion comunal </p>
                    </div>
                </div>


                <nav className="flex items-center gap-2">
                    <Link
                        href="/home"
                        className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white"
                    >
                        Inicio
                    </Link>

                    <Link
                        href="/news"
                        className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white"
                    >
                        Noticias
                    </Link>

                    <Link href="/events" className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white">
                        Eventos
                    </Link>

                    <Link href="/service" className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white">
                        Servicios
                    </Link>

                    <Link href="/contact" className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white">
                        Contacto
                    </Link>

                </nav>


            </div>

        </header>
    )
}