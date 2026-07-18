import { useTexture } from "@react-three/drei"
import { useMemo } from "react";
import type { StarsMeta } from "../types";

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

export function ciToRGB(ci: number) {
    const BLUE: [number, number, number] = [155 / 255, 176 / 255, 255 / 255]; // ci ~ -0.3 (estrela O/B)
    const WHITE: [number, number, number] = [255 / 255, 255 / 255, 255 / 255]; // ci ~  0.6 (tipo Sol)
    const ORANGE: [number, number, number] = [255 / 255, 154 / 255, 90 / 255];  // ci ~  2.0 (estrela M)

    const clamped = Math.max(0.0, Math.min(0.8, ci));
    let rgb: number[];

    if (clamped <= 0.4) {
        const t = clamped / 0.4;
        rgb = lerpColor(BLUE, WHITE, t);
    } else {
        const t = (clamped - 0.4) / (0.8 - 0.4);
        rgb = lerpColor(WHITE, ORANGE, t);
    }

    return rgb;
}

type Props = {
    meta: StarsMeta | null,
    buffer: Float32Array | null
}

export function Stars({meta, buffer}:Props) {
    const circle = useTexture("/circle.png")

    const { positions, colors } = useMemo(() => {
        if(!meta || !buffer){
        return {positions: new Float32Array(0), colors: new Float32Array(0)}
        }

        const N = meta.count
        const S = meta.stride

        const positions = new Float32Array(N * 3);
        const colors = new Float32Array(N * 3);
        
        for(let i = 0; i < N; i++){
        positions[i * 3] =     buffer[i * S]
        positions[i * 3 + 1] = buffer[i * S + 1]
        positions[i * 3 + 2] = buffer[i * S + 2]
        
        const [r, g, b] = ciToRGB(buffer[i * S + 3])
        colors[i * 3] =     r
        colors[i * 3 + 1] = g
        colors[i * 3 + 2] = b
        }
        
        return { positions, colors };
    }, [buffer, meta])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach={"attributes-position"}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach={"attributes-color"}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                vertexColors
                size={0.5}
                sizeAttenuation
                map={circle}
                transparent
                alphaTest={0.5}
            />
        </points>
    )
}