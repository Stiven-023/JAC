import Card from "@/components/Card";
import { newsData } from "@/data/news";
import { obtenerNoticias } from "@/modules/new/action";
import { NewTypes } from "@modules/new/types"


export default async function Page() {
    let news: NewTypes[] = [];

    try {
        news = await obtenerNoticias();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
    console.log(news.length)
    console.log(news)

    return (
        <div className="flex flex-col justify-center items-center h-[78vh]">
            <h1 className="mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Noticias</h1>
            <div className="grid grid-cols-1 place-content-center gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">
                {news.map((release) => (
                    <Card
                        key={release.id}
                        title={release.title}
                        description={release.description}
                        date={release.date ? new Date(release.date).toLocaleDateString('es-CO') : undefined}
                    />
                ))}
            </div>
        </div>
    );
}