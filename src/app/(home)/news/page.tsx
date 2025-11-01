import Card from "@/app/components/Card";

export default function Page() {
    return (
        <div>
            <h1 className="text-center mb-4">Eventos</h1>
            <div className=" whitespace-pre-line grid grid-cols-2 gap-4 text-xs px-60 ">
                <Card

                    title="Jornada de limpieza "
                    description="Este sabado realizaremos una  jornada de limpieza en el parque" date="2024-07-01" />
                <Card title="Actualización del reglamento interno" description="Descripción del evento 1" date="2024-07-01" />
                <Card title="Nuevo servicio de reciclaje puerta a puerta" description="Descripción del evento 1" date="2024-07-01" />
                <Card title="Convocatoria a reunion mensual" description="Descripción del evento 1" date="2024-07-01" />
            </div>

        </div>


    )

}