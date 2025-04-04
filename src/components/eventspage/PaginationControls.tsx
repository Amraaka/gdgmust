'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paramName: string;
  preserveParams?: string[];
}

export default function Pagination({
  currentPage,
  totalPages,
  paramName,
  preserveParams = []
}: PaginationProps) {
  const searchParams = useSearchParams();
  const t = useTranslations('Pagination');
  
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, pageNumber.toString());
    
    preserveParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });
    
    return `?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push('...');
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };
  
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 my-8" aria-label="pagination">
      {currentPage > 1 && (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {t('prev')}
        </Link>
      )}
      
      {getPageNumbers().map((pageNum, index) => (
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
        ) : (
          <Link
            key={`page-${pageNum}`}
            href={createPageUrl(pageNum as number)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum 
                ? 'bg-zinc-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </Link>
        )
      ))}
      
      {currentPage < totalPages && (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {t('next')}
        </Link>
      )}
    </nav>
  );
}
