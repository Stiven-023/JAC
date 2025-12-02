'use client'
import Link from 'next/link';
import React from 'react';

type Props = {
  page: number;
  totalPages: number;
  perPage?: number;
  basePath?: string; // ruta base, por ejemplo '/events' o '' para la misma ruta
  onChange?: (page: number) => void; // si se pasa, usa client-side navigation
};

export default function EvenList({ page, totalPages, perPage = 6, basePath = '', onChange }: Props) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const disabledPrev = page <= 1;
  const disabledNext = page >= totalPages;

  const handleClick = (p: number) => {
    if (onChange) onChange(p);
  };

  const buildHref = (p: number) => {
    const sep = basePath.includes('?') ? '&' : '?';
    return `${basePath}${sep}page=${p}&perPage=${perPage}`;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {onChange ? (
        <>
          <button
            onClick={() => handleClick(prev)}
            disabled={disabledPrev}
            aria-label="Página anterior"
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <div className="px-3 py-1 rounded bg-white border text-sm font-medium">
            {page} / {totalPages}
          </div>

          <button
            onClick={() => handleClick(next)}
            disabled={disabledNext}
            aria-label="Página siguiente"
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </>
      ) : (
        <>
          <Link href={buildHref(prev)} aria-disabled={disabledPrev}>
            <button disabled={disabledPrev} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
          </Link>

          <div className="px-3 py-1 rounded bg-white border text-sm font-medium">
            {page} / {totalPages}
          </div>

          <Link href={buildHref(next)} aria-disabled={disabledNext}>
            <button disabled={disabledNext} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
          </Link>
        </>
      )}
    </div>
  );
}