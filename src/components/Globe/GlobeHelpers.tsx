import * as THREE from "three";

export function addFlag(scene: THREE.Scene, radius: number, lat: number, lon: number) {
  const flagMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("/flag.png"), // Chemin vers l'image du drapeau
    transparent: true,
  });
  const flag = new THREE.Sprite(flagMaterial);

  // Convertir latitude et longitude en coordonnées 3D
  const phi = (90 - lat) * (Math.PI / 180); // Latitude en radians
  const theta = (lon + 180) * (Math.PI / 180); // Longitude en radians

  // Calculer les coordonnées
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  flag.position.set(x, y, z);
  flag.scale.set(0.5, 0.5, 0.5); // Taille du drapeau

  scene.add(flag);
}
