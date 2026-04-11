// frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook for "deferred" meanings. Useful for input fields,
 * to avoid sending a request for every keystroke.
 * @param value - Value to be deferred
 * @param delay - Latency in milliseconds
 * @returns Deferred value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer that will update the value after a delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer every time the value changes or when a component is unmounted
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}