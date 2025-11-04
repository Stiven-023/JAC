import ServiceCard from "@/app/components/ServiceCard";
import { Fa500Px } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaCommentDots } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function Page() {
    return (
        <div>
            <h1 className="text-center mb-4">Servicios</h1>
            <div className="flex flex-col lg:grid grid-cols-2 gap-4 text-xs ">
                <ServiceCard icon={FaTools} title=" Solicitar mantenimiento o reparación" description="Reporta daños o solicita manteminimento en zonas comunes" />
                <ServiceCard icon={FaCommentDots} title=" Solicitar mantenimiento o reparación" description="Reporta daños o solicita manteminimento en zonas comunes" />
                <ServiceCard icon={CgFileDocument} title=" Solicitar mantenimiento o reparación" description="Reporta daños o solicita manteminimento en zonas comunes" />
                <ServiceCard icon={AiOutlinePlusCircle} title=" Solicitar mantenimiento o reparación" description="Reporta daños o solicita manteminimento en zonas comunes" />
            </div>

        </div>

    )
}
