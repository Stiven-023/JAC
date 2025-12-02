import Card from "@/components/Card";
import { obtenerEventos } from "@/modules/events/action";
import { Event } from "@/modules/events/types";

export default async function Page() {
    let events: Event[] = [];

    try {
        events = await obtenerEventos();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
    console.log(events.length)
    console.log(events)

    return (
        <div className="flex flex-col justify-center items-center h-[78vh]">
            <h1 className="mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Eventos</h1>

            <div className="grid grid-cols-1 gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">
                {events.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">No hay eventos disponibles</p>
                ) : (
                    events.map((event) => (
                        <Card
                            key={event.id}
                            title={event.title}
                            description={event.description}
                            date={event.date ? new Date(event.date).toLocaleDateString('es-CO') : undefined}
                        />
                    ))
                )}
            </div>

        </div>
    );
}