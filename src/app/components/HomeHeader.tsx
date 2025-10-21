import { FaHome } from 'react-icons/fa';
export default function HomeHeader() {
    return (

        <header className='shadow-md bg-red-primary text-white py-2'>
            <div className='flex px-4 space-x-4'>
                <div className='rounded-full bg-white p-2 '>
                    <FaHome size={20} color="red" />
                </div>
                <div >
                    <h1>JAC</h1>
                    <p className='text-xs'>Junta de accion comunal </p>
                </div>


            </div>

        </header>
    )
}