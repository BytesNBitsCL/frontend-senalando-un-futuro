'use client'

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
        const [matches, setMatches] = useState<boolean | undefined>(undefined);
        useEffect(() => {
            const media = window.matchMedia(query);
            setMatches(media.matches);
            
            const listener = () => setMatches(media.matches);
            media.addEventListener('change', listener);
            
            return () => media.removeEventListener('change', listener);
        }, [query]);
        return matches;
};