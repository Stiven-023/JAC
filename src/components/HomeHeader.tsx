'use client'
import { FaHome } from 'react-icons/fa';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { manejarCierreSesion } from '@/app/login/action';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';

const menuItems = [
    { name: 'Noticias', href: '/news' },
    { name: 'Eventos', href: '/events' },
    { name: 'Servicios', href: '/service' },
    { name: 'Contacto', href: '/contact' },
];

const ADMIN_EMAIL = 'admin@jac.com.co';

export default function HomeHeader() {
    
    const [isOpen, setIsOpen] = useState(false);

    const supabase = createClientComponentClient();
  
  // Estado para guardar la sesión
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  
  // Efecto para obtener la sesión al cargar el componente
  useEffect(() => {
      // Función asíncrona para obtener la sesión
      const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session);
    };


    // Llama a la función para obtener la sesión
    getSession();
    
}, []);

const toggelMenu = () => {
    setIsOpen(!isOpen)
}
const router = useRouter();

const handleLogout = async () => {
    const result = await manejarCierreSesion();
    
    if (result.success) {
        // Redirigir al login después de cerrar sesión
        router.push('/login');
        router.refresh(); // Refrescar para limpiar el estado
    } else {
        // Mostrar mensaje de error
        alert(result.message);
        }
    };
    const isAdmin = session?.user?.email === ADMIN_EMAIL;

    const openIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>)
    const closeIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>)
    return (

        <header className='shadow-md bg-red-primary text-white py-2'>
            <div className='flex px-4 space-x-4 justify-between'>
                <div className='flex px-4 space-x-4'>
                    <div className='rounded-full bg-white p-2 '>
                        <FaHome size={20} color="red" />
                    </div>
                    <div >
                        <h1>JAC</h1>
                        <p className='text-xs'>Junta de acción comunal </p>
                    </div>
                </div>
                <div className='lg:hidden'>
                    <button onClick={toggelMenu}>
                        {isOpen ? closeIcon : openIcon}
                    </button>
                </div>

                <nav className="hidden lg:flex lg:items-center lg:gap-2 " >
                    {menuItems.map((item, index) => {
                        return (
                            <Link key={index} className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white" href={item.href}>
                                {item.name}
                            </Link>
                        )
                    })}
                    {
                     isAdmin && (
                    <Link  className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white" href={'/admin'}>
                        Administrador
                    </Link>)
                    }
                    <div onClick={handleLogout} className='cursor-pointer'>
                        Cerrar Sesión
                    </div>
                </nav>
            </div>

            <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <nav className="flex flex-col space-y-2 items-end px-2">
                    {menuItems.map((item, index) => {
                        return (
                            <Link key={index} className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white" href={item.href}>
                                {item.name}
                            </Link>
                        )
                    })}
                    {
                     isAdmin && (
                    <Link  className="px-2 py-1 rounded-xl transition duration-200 border-2 border-transparent hover:border-white" href={'/admin'}>
                        Administrador
                    </Link>)
                    }
                    <div onClick={handleLogout} className='cursor-pointer'>
                        Cerrar Sesión
                    </div>
                </nav>
            </div>

        </header>
    )
}