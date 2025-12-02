'use client'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function Pagination({ totalpages }: { totalpages: number }) {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        replace(`${pathName}?${params.toString()}`);
    }


    return (
        <div className='flex justify-center items-center gap-4 mt-8'>
            <button
                disabled={currentPage <= 1}
                onClick={() => createPageUrl(currentPage - 1)}
                aria-label="Página anterior"
                className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300`}
            >
                Anterior
            </button>


            <span>
                Página {currentPage} de {totalpages}
            </span>

            <button
                disabled={currentPage >= totalpages}
                onClick={() => createPageUrl(currentPage + 1)}
                aria-label="Página siguiente"
                className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300`}
            >
                Siguiente
            </button>

        </div>
    );
}