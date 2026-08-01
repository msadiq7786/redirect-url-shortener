import { useCallback, useRef } from "react";

interface UseDebounceParams<T extends unknown[]> {
    delay: number;
    func: (...args: T) => void;
}

export function useDebounce<T extends unknown[]>({
    delay,
    func,
}: UseDebounceParams<T>) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return useCallback(
        (...args: T) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                func(...args);
            }, delay);
        },
        [delay, func],
    );
}
