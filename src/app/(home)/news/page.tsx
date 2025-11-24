import Card from "@/components/Card";

export default function Page() {
    return (
        <div className="flex flex-col justify-start">
            <h1 className="-mt-10 mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Noticias</h1>
            <div className="grid grid-cols-1 gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">

                <Card title="Jornada de limpieza" description="Este sabado realizaremos una  jornada de limpieza en el parque" date="2024-07-01" />
                <Card title="Actualización del reglamento interno" description="Descripción del evento 1" date="2024-07-01" />
                <Card title="Nuevo servicio de reciclaje puerta a puerta" description="Descripción del evento 1" date="2024-07-01" />
                <Card title="Convocatoria a reunion mensual" description="Descripción del evento 1" date="2024-07-01" />
            </div>

        </div>


    )

}