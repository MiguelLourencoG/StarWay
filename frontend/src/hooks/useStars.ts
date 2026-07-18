import { useEffect, useState } from "react";
import type { StarsMeta } from "../types";

export const useStars = () => {

    const [meta, setMeta] = useState<StarsMeta | null>(null)
    const [buffer, setBuffer] = useState<Float32Array | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchStars = async () => {
        try {
            console.time("fetch stars")
            setIsLoading(true)
            setError(null)

            const [metaJson, arrayBuffer] = await Promise.all([
                fetch("http://127.0.0.1:8000/stars/meta").then((r) => r.json()),
                fetch("http://127.0.0.1:8000/stars/binary").then((r) => r.arrayBuffer()),
            ])
            console.timeEnd("fetch stars")
            setMeta(metaJson)
            setBuffer(new Float32Array(arrayBuffer))

        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error(String(err)))
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => { fetchStars() }, []);

    return {
        meta,
        buffer,
        isLoading,
        error
    }
}

