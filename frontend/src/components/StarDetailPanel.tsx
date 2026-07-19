import { Html } from "@react-three/drei";
import { useStarDetails } from "../hooks/useStarDetails";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

type Props = {
  selectedId: number | null;
  position: [number, number, number] | null;
  onClose: () => void;
};

export function StarDetailPanel({ selectedId, position, onClose }: Props) {
  const { detail, isLoading, error } = useStarDetails(selectedId);
  const { camera } = useThree();
  const [side, setSide] = useState<"left" | "right">("right");

  useFrame(() => {
    if (!position) return;
    const vec = new THREE.Vector3(...position).project(camera);
    setSide(vec.x > 0.3 ? "left" : "right")
  });

  if (selectedId === null || position === null) return null;

  return (
    <Html position={position} zIndexRange={[100, 0]}>
      {detail && (
        <div style={{
          width: 320,
          padding: 20,
          background: "rgba(0, 0, 0, 0.85)",
          color: "white",
          border: "1px solid #333",
          borderRadius: 8,
          fontFamily: "monospace",
          transform: side === "right" ? "translate(20px, -50%)" : "translate(calc(-100% - 20px), -50%)"
        }}>
          <button
            onClick={onClose}
            style={{
              float: "right",
              background: "transparent",
              color: "white",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >×</button>

          {isLoading && <p>Carregando...</p>}
          {error && <p style={{ color: "salmon" }}>Erro: {error.message}</p>}
          {detail && (
            <>
              <h3 style={{ margin: "0 0 10px 0" }}>
                {detail.proper ?? `Estrela #${detail.id}`}
              </h3>
              <p>Constelação: {detail?.con ?? "—"}</p>
              <p>Tipo espectral: {detail?.spect ?? "—"}</p>
              <p>Magnitude aparente: {detail?.mag?.toFixed(2)}</p>
              <p>Magnitude absoluta: {detail?.absmag?.toFixed(2)}</p>
              <p>Distância: {detail?.dist?.toFixed(2)} pc</p>
              <p>Luminosidade: {detail?.lum?.toFixed(2)} L☉</p>
            </>
          )}
        </div>)}
    </Html>
  );
}