import { useEffect, useRef } from "react";

function usePrevious<T>(value: T): T | null {
    const valueRef = useRef<T | null>(null);

    useEffect(() => {
        valueRef.current = value;
    }, [value])

    return valueRef.current;
}

export default usePrevious;