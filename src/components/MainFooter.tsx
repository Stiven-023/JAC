import { FaHome } from 'react-icons/fa';

export default function MainFooter() {
    return (

        <footer className="shadow-md bg-red-primary text-white py-2">
            <div className='flex flex-col items-center  '>
                <div className='rounded-full bg-white p-1 '>
                    <FaHome size={20} color="red" />
                </div>
                <h1>JAC</h1>
                <p className='text-xs'>Junta de accion comunal </p>
                <p className='text-xs'>Copyrigth © 2025 - JAC</p>

            </div>

        </footer>

    )


}