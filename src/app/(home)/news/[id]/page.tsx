import { getNewsById } from '@/data/news';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const news = getNewsById(id);

    if (!news) {
        notFound();
    }

    return (
        <div className="flex flex-col justify-start max-w-4xl mx-auto px-6 py-8">
            <Link 
                href="/news" 
                className="mb-6 text-blue-600 hover:text-blue-800 hover:underline"
            >
                ← Volver a Noticias
            </Link>
            
            <article className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-black mb-4 text-gray-900">{news.title}</h1>
                
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <p className="text-gray-600">
                        <span className="font-semibold">Fecha:</span> {news.date}
                    </p>
                </div>

                <div className="prose max-w-none">
                    <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                        {news.fullContent}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link 
                        href="/news" 
                        className="inline-block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        ← Volver a Noticias
                    </Link>
                </div>
            </article>
        </div>
    );
}

