import { useEffect, useState } from "react";

export const useStarDetails = (id: number | null) => {

    const [detail, setDetail] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (id === null || id === undefined) {
            setDetail(null)
            return
        }

        let cancelled = false;

        const fetchDetail = async () => {
            try {

                setIsLoading(true)
                setError(null)

                const res = await fetch(`http://127.0.0.1:8000/stars/${id}`)
                if (!res.ok) throw new Error(`HTTP${res.status}`)
                const data = await res.json();
                if (!cancelled) setDetail(data)

            } catch (err: unknown) {
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchDetail()

        return () => {cancelled = true}

    }, [id]);

    return {
        detail,
        isLoading,
        error
    }
}

