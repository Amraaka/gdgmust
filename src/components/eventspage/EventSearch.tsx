'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
  
    if (debouncedQuery) {
      params.set('search', debouncedQuery);
      // Reset pagination only if a real search is happening
      params.delete('upcomingPage');
      params.delete('pastPage');
    } else {
      params.delete('search');
      // Keep upcomingPage/pastPage if no search query
    }
  
    router.push(`?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  const handleClearSearch = () => {
    setQuery('');
  };
  
  const handleSearch = () => {
    setDebouncedQuery(query);
  };
  
  return (
    <div className="lg:w-[350px] w-[320px] md:w-[345px] select-none"
    draggable="false">
      <div className="flex items-center relative h-[46px] w-full bg-white rounded-full border border-black px-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('EventsPage.SearchBar.text')}
          className="flex-grow ml-2 mb-[2px] h-full bg-transparent outline-none text-base placeholder-zinc-300 select-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="flex items-center justify-center bg-zinc-300 w-9 h-9 rounded-full"
          aria-label="Search"
        >
          {query && (
            <button
              onClick={handleClearSearch}
              className="scale-125"
              aria-label="Clear search"
            >
              <IoClose />
            </button>
          ) || <IoSearch className="scale-125" />}
        </button>
      </div>
    </div>
  );
}