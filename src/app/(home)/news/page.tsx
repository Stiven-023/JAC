import Card from "@/components/Card";
import { newsData } from "@/data/news";

export default function Page() {
    return (
        <div className="flex flex-col justify-start">
            <h1 className="-mt-10 mb-6 text-center text-3xl font-black tracking-tight text-[#0f0f0f]">Noticias</h1>
            <div className="grid grid-cols-1 gap-4 px-6 text-sm 
                      md:grid-cols-2 md:px-10 md:text-base 
                      lg:grid-cols-2 lg:px-32 lg:text-sm">
                {newsData.map((news) => (
                    <Card
                        key={news.id}
                        id={news.id}
                        title={news.title}
                        description={news.description}
                        date={news.date}
                    />
                ))}
            </div>
        </div>
    );
}