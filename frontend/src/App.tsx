import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

import { CameraZoom, CameraOrbit } from "./components/CameraControls"
import { Stars } from "./components/Stars"
import { useStars } from "./hooks/useStars"


function App() {

  const { buffer, meta } = useStars();

  return (
    <div 
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }}>
      <p>Número de estrelas: {meta?.count ?? "Carregando..."}</p>
      <Canvas
        camera={{position: [0, 20, 20]}}
        dpr={[1, 1.5]}
        style={{height: "100vh", width: "80vw"}}
      >
        <Stats/>
        <OrbitControls makeDefault listenToKeyEvents={window} keyPanSpeed={20} />
        <CameraOrbit accel={0.00005} damping={0.98}/>
        <CameraZoom accel={0.0005} />
        <Stars 
          buffer={buffer} 
          meta={meta}
        />
        <EffectComposer>
          <Bloom
            intensity={0.4}
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
