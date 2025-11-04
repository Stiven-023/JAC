import Card from "@/app/components/Card";

export default function Page() {
    return (
        <div>
            <h1 className="text-center mb-4">Eventos</h1>
            <div className="flex flex-col lg:text-sm space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
            </div>

        </div>


    )

}