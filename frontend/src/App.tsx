import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats, useTexture } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useEffect, useMemo, useState } from "react"

function Stars({positions, colors}){
    const circle = useTexture("/circle.png")
    return(
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

function App() {

  const [stars, setStars] = useState([]);
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stars")
      .then(r => r.json())
      .then(setStars);
  }, []);


  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
  }

  function ciToRGB(ci: number) {
    // âncoras em RGB (0-255): azul quente -> branco -> vermelho frio
    const BLUE:   [number, number, number] = [155/255, 176/255, 255/255]; // ci ~ -0.3 (estrela O/B)
    const WHITE:  [number, number, number] = [255/255, 255/255, 255/255]; // ci ~  0.6 (tipo Sol)
    const ORANGE: [number, number, number] = [255/255, 154/255, 90/255];  // ci ~  2.0 (estrela M)

    const clamped = Math.max(0.0, Math.min(0.8, ci));
    let rgb: number[];

    if (clamped <= 0.4) {
      const t = clamped / 0.4;              // 0..1 entre BLUE e WHITE
      rgb = lerpColor(BLUE, WHITE, t);
    } else {
      const t = (clamped - 0.4) / (0.8 - 0.4); // 0..1 entre WHITE e ORANGE
      rgb = lerpColor(WHITE, ORANGE, t);
    }

    return rgb;
  }

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    
    for(let i = 0; i < stars.length; i++){
      positions[i * 3] = stars[i].x
      positions[i * 3 + 1] = stars[i].y
      positions[i * 3 + 2] = stars[i].z
      
      const [r, g, b] = ciToRGB(stars[i].ci)
      colors[i * 3] =     r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    console.log("Posições: ", positions);
    console.log("Cores: ", colors);
    
    return { positions, colors };
  }, [stars])

  return (
    <div>
      <text>Número de estrelas: {stars.length}</text>
      <Canvas camera={{position: [0, 20, 20]}} dpr={[1, 1.5]} style={{height: "80vh"}}>
        <Stats/>
        <OrbitControls />
        <Stars 
          positions={positions} 
          colors={colors}
        />
        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
            resolutionScale={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default App
