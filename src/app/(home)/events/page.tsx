import Card from "@/app/components/Card";

export default function Page() {
    return (
        <div>
            <h1 className="text-center mb-4">Eventos</h1>
            <div className="grid grid-cols-2 gap-4 text-xs">
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
                <Card title="Mantenimiento Piscina " hour="Descripción del evento 1" date="2024-07-01" place="Casas" />
            </div>

        </div>


    )

}