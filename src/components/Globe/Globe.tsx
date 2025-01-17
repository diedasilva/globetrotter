"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import { createFlag } from "./Flag";
import { useDestinations } from "@/hooks/useDestinations";
interface Destination {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
}

export default function GlobeComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const sphereRef = useRef<THREE.Mesh | null>(null);
  const flagsGroupRef = useRef<THREE.Group | null>(null);

  const { destinations, error, isLoading } = useDestinations();

  useEffect(() => {
    if (!mountRef.current || isInitialized.current) return;

    isInitialized.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create a sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load("/globe.jpg"),
          },
        },
      })
    );

    sphereRef.current = sphere;

    // Create an atmosphere
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );

    atmosphere.scale.set(1.1, 1.1, 1.1);
    scene.add(atmosphere);

    const flagsGroup = new THREE.Group();
    flagsGroupRef.current = flagsGroup;
    sphere.add(flagsGroup);

    const group = new THREE.Group();
    scene.add(group);

    // Add ambient light to see the flags
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    // Add the globe to the group
    group.add(sphere);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = Array.from({ length: 20000 }, () => [
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      -Math.random() * 2000,
    ]).flat();

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 15;

    let isMouseDown = false;
    let isMouseMoving = false;

    const mouse = { x: 0, y: 0 };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isMouseDown || !isMouseMoving) {
        sphere.rotation.y += 0.0002;
      }
      gsap.to(group.rotation, {
        x: mouse.y * 2,
        y: mouse.x * 2,
        duration: 2,
        ease: "power3.out",
      });
      renderer.render(scene, camera);
    };

    animate();

    // Event handlers
    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        isMouseMoving = true;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleZoom = (event: WheelEvent) => {
      event.preventDefault();
      const newZoom = camera.position.z + event.deltaY * 0.01;
      gsap.to(camera.position, {
        z: Math.max(5, Math.min(50, newZoom)),
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Event listeners
    document.addEventListener("mousedown", () => {
      isMouseDown = true;
      isMouseMoving = false;
      document.addEventListener("mousemove", onMouseMove);
    });

    document.addEventListener("mouseup", () => {
      isMouseDown = false;
      isMouseMoving = false;
      document.removeEventListener("mousemove", onMouseMove);
    });

    window.addEventListener("wheel", handleZoom);
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("mouseup", () => {});
      sphere.geometry.dispose();
      sphere.material.dispose();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sphereRef.current || !flagsGroupRef.current || !destinations) return;

    // On supprime d’abord tous les anciens drapeaux
    flagsGroupRef.current.clear();

    // On crée un drapeau pour chaque destination
    destinations.forEach((dest: Destination) => {
      const flag = createFlag(dest.latitude, dest.longitude, 5.05, {
        cityName: dest.city,
        flagColor: "white",
        mastColor: "white",
        flagWidth: 0.5,
        flagHeight: 0.4,
        flagTextureUrl: `/flags/${dest.country}.svg`,
      });
      flagsGroupRef.current?.add(flag);
    });
  }, [destinations]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
