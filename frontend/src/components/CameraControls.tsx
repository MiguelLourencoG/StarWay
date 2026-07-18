import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CameraZoom({ accel = 0.001, damping = 0.92 }: { accel?: number; damping?: number }) {
    const { camera } = useThree();
    const keys = useRef({ in: false, out: false });
    const velocity = useRef(0);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        if (e.key === "q" || e.key === "Q") keys.current.in = true;
        if (e.key === "e" || e.key === "E") keys.current.out = true;
        };
        const up = (e: KeyboardEvent) => {
        if (e.key === "q" || e.key === "Q") keys.current.in = false;
        if (e.key === "e" || e.key === "E") keys.current.out = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        };
    }, []);

    useFrame(() => {
        if (keys.current.in)  velocity.current -= accel;
        if (keys.current.out) velocity.current += accel;

        velocity.current *= damping;

        if (Math.abs(velocity.current) > 0.00001) {
        camera.position.multiplyScalar(1 + velocity.current);
        }
    });

    return null;
}

export function CameraOrbit({ accel = 0.001, damping = 0.92 }: { accel?: number; damping?: number }) {
    const { camera } = useThree();
    const keys = useRef({ w: false, a: false, s: false, d: false });
    const velocity = useRef({ horizontal: 0, vertical: 0 });

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in keys.current) keys.current[k as keyof typeof keys.current] = true;
        };
        const up = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k in keys.current) keys.current[k as keyof typeof keys.current] = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        };
    }, []);

    useFrame(() => {
        if (keys.current.a) velocity.current.horizontal += accel;
        if (keys.current.d) velocity.current.horizontal -= accel;
        if (keys.current.w) velocity.current.vertical   += accel;
        if (keys.current.s) velocity.current.vertical   -= accel;

        velocity.current.horizontal *= damping;
        velocity.current.vertical   *= damping;

        if (Math.abs(velocity.current.horizontal) < 0.00001 && Math.abs(velocity.current.vertical) < 0.00001) return;

        const target = new THREE.Vector3(0, 0, 0);
        const offset = camera.position.clone().sub(target);

        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), velocity.current.horizontal);

        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        offset.applyAxisAngle(right, velocity.current.vertical);

        camera.position.copy(target).add(offset);
        camera.lookAt(target);
    });

    return null;
}

