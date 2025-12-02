'use client'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type Props = {
    totalpages: number;
    currentPage?: number;
    perPage?: number;
    basePath?: string;
};

export default function Pagination({ totalpages, currentPage, perPage, basePath }: Props) {
    const pathname = usePathname() ?? '/';
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageFromQuery = Number(searchParams.get('page')) || 1;
    const page = currentPage ?? pageFromQuery;
    const prev = Math.max(1, page - 1);
    const next = Math.min(totalpages, page + 1);

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        params.set('page', String(pageNumber));
        if (perPage != null) params.set('perPage', String(perPage));
        const path = basePath ?? pathname;
        return `${path}${params.toString() ? `?${params.toString()}` : ''}`;
    };

    const changePage = (pageNumber: number) => {
        // replace para no crear historial extra
        router.replace(createPageUrl(pageNumber));
    };

    return (
        <div className='flex justify-center items-center gap-4 mt-8'>
            <button
                disabled={page <= 1}
                onClick={() => changePage(prev)}
                aria-label="Página anterior"
                className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300`}
            >
                Anterior
            </button>

            <span>
                Página {page} de {totalpages}
            </span>

            <button
                disabled={page >= totalpages}
                onClick={() => changePage(next)}
                aria-label="Página siguiente"
                className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300`}
            >
                Siguiente
            </button>
        </div>
    );
}