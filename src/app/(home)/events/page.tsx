import Card from "@/components/Card";

export default function Page() {
    return (
        <div className="flex flex-col justify-start">
            <h1 className="-mt-10 mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Eventos</h1>
            <div className="grid grid-cols-1 gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">

                <Card title="Mantenimiento Piscina" description="Se realizará limpieza profunda y verificación de equipos." date="2025-10-10" />
                <Card title="Brigada de jardinería" description="Invitamos a los vecinos a participar en el embellecimiento del parque." date="2025-10-15" />
                <Card title="Revisión del salón comunal" description="Inspección y mantenimiento de luminarias y mobiliario." date="2025-10-20" />
                <Card title="Jornada de reciclaje" description="Recepción de material reciclable y charla educativa." date="2025-10-25" />
            </div>

        </div>


    )

}