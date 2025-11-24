import Link from 'next/link';

export default function Card({ 
    id, 
    title, 
    description, 
    date, 
    hour, 
    place 
}: { 
    id?: string;
    title: string; 
    description?: string; 
    date: string; 
    hour?: string; 
    place?: string;
}) {
    const content = (
        <div className="flex flex-col bg-[#D9D9D9] p-4 rounded-lg shadow-md space-y-2 h-full">
            <div>
                <h1 className="font-bold mb-2 text-center">{title}</h1>
                <p>
                    <span className="font-semibold">Fecha: </span>
                    {date}
                </p>
                {hour && (
                    <p>
                        <span className="font-semibold">Hora: </span>
                        {hour}
                    </p>
                )}
                {place && (
                    <p>
                        <span className="font-semibold">Lugar: </span>
                        {place}
                    </p>
                )}
                {description && (
                    <p className="whitespace-pre-line break-all">
                        <span className="font-semibold">Descripción: </span>
                        {description}
                    </p>
                )}
            </div>
            <div className="flex justify-end mt-auto">
                <span className="hover:underline cursor-pointer">Leer mas</span>
            </div>
        </div>
    );

    if (id) {
        return (
            <Link href={`/news/${id}`} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
}
