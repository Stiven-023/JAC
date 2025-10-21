import { FaNewspaper } from 'react-icons/fa';
import { MdEventNote } from 'react-icons/md';
import { FaCogs } from 'react-icons/fa';
import { BiSolidContact } from 'react-icons/bi';
export default function Page() {
    return (
        <div className="flex flex-col text-center">
            <div className="mb-4">
                <h1 className="font-bold">¡Bienvenido a la comunidad JAC!</h1>
                <p>Junta de accion comunal de su conjunto residencial. <br></br>
                    Desde aqui puedes ver noticias, eventos y administrar servicios
                </p>
            </div>

            <div className="grid grid-cols-2  gap-8 w-80 items-center mx-auto">
                <div className="bg-[#D9D9D9] rounded-md px-2 py-1 flex flex-col items-center"><FaNewspaper size={60} />Noticias</div>
                <div className="bg-[#D9D9D9] rounded-md px-2 py-1 flex flex-col items-center"><MdEventNote size={60} /> Eventos</div>
                <div className="bg-[#D9D9D9] rounded-md px-2 py-1 flex flex-col items-center"><FaCogs size={60} />Service</div>
                <div className="bg-[#D9D9D9] rounded-md px-2 py-1 flex flex-col items-center"> <BiSolidContact size={60} />Contact</div>
            </div>
        </div>


    )
}