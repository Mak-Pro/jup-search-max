import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

type Params = { width: number; height: number };

export const useWindowWidth = (): Params => {
    const [params, setParams] = useState<Params>({
        width: 1200,
        height: 800,
    });

    const resizeHandler = debounce(() => {
        if (window) {
            setParams({ width: window.innerWidth, height: window.innerHeight });
            document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
            document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
        }
    }, 100);

    useEffect(() => {
        if (window) {
            setParams({ width: window.innerWidth, height: window.innerHeight });
            document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
            document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
            window.addEventListener('resize', resizeHandler);
            return () => {
                window.removeEventListener('resize', resizeHandler);
            };
        }
    }, []);
    return params;
};

