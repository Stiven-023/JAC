import ServiceCard from "@/components/ServiceCard";
import { FaTools } from 'react-icons/fa';
import { FaCommentDots } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function Page() {
    return (
        <div className="flex flex-col justify-start">
            <h1 className="-mt-10 mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Servicios</h1>
            <div className="grid grid-cols-1 gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">
                <ServiceCard icon={FaTools} title="Solicitud de mantenimiento" description="Reporta daños o solicita mantenimiento en las zonas comunes para asegurar un uso seguro." />
                <ServiceCard icon={FaCommentDots} title="Canal de sugerencias" description="Envía comentarios e ideas para mejorar los servicios y espacios comunitarios." />
                <ServiceCard icon={CgFileDocument} title="Trámites y documentos" description="Solicita certificados, constancias u otros documentos emitidos por la JAC." />
                <ServiceCard icon={AiOutlinePlusCircle} title="Nuevos proyectos" description="Propón y haz seguimiento a iniciativas que beneficien al barrio." />
            </div>
        </div>
    );
}