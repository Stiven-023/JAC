'use client'
import { FaHome } from 'react-icons/fa';
import Link from 'next/link'
import { useState } from 'react';

const menuItems = [
    { name: 'Inicio', href: '/home' },
    { name: 'Noticias', href: '/news' },
    { name: 'Eventos', href: '/events' },
    { name: 'Servicios', href: '/service' },
    { name: 'Contacto', href: '/contact' },
];

export default function HomeHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const toggelMenu = () => {
        setIsOpen(!isOpen)
    }
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
                        <p className='text-xs'>Junta de accion comunal </p>
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
                </nav>
            </div>

        </header>
    )
}