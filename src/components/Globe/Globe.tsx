"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";

export default function GlobeComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

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

    // Create a atmosphere
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

    const group = new THREE.Group();
    group.add(sphere);
    scene.add(group);

    //Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
    });

    const starVertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 15;

    let isMouseDown = false;
    let isMouseMoving = false;

    const mouse = {
      x: 0,
      y: 0,
    };

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

    // Handle mouse movement
    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        isMouseMoving = true;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

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

    // Change cursor on hover
    renderer.domElement.addEventListener("mouseenter", () => {
      renderer.domElement.style.cursor = "grab";
    });

    renderer.domElement.addEventListener("mouseleave", () => {
      renderer.domElement.style.cursor = "default";
    });

    renderer.domElement.addEventListener("mousedown", () => {
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("mouseup", () => {
      renderer.domElement.style.cursor = "grab";
    });

    // Handle resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      sphere.geometry.dispose();
      sphere.material.dispose();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
