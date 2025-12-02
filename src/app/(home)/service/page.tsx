// ...existing imports...
import { obtenerServicios, } from "@/modules/services/action";
import Pagination from "@/modules/new/Pagination";
import ServiceItem from "@/modules/services/components/ServiceItem";

export default async function ServiciosPage({
    searchParams
}: {
    searchParams: { page?: string };
}) {
    const currentPage = Number(searchParams.page) || 1;
    const { data: servicios, totalPages } = await obtenerServicios(currentPage);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Servicios Disponibles</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicios.map((servicio) => (
                    <ServiceItem key={servicio.id} servicio={servicio} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination totalpages={totalPages} currentPage={currentPage} />
            )}
        </div>
    );
}