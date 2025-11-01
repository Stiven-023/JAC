import ServiceCard from "@/app/components/ServiceCard";
import { Fa500Px } from 'react-icons/fa';



export default function Page() {
    return (
        <div>
            <ServiceCard icon={Fa500Px} title="Icono" description="Descripcion del icono" />
        </div>
    )
}
